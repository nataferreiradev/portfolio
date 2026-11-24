#!/usr/bin/env bash
# deploy.sh — publica o portfólio no GitHub Pages e/ou na Hostinger.
#
# Uso:
#   ./deploy.sh [alvo] [opções]
#
# Alvos:
#   all         GitHub Pages + Hostinger (padrão)
#   github      só GitHub Pages (git push)
#   hostinger   só Hostinger (SSH/rsync ou FTP)
#
# Opções:
#   -n, --dry-run    mostra o que seria enviado, sem enviar nada
#   -m, --message    mensagem de commit se houver alterações pendentes
#   -y, --yes        não pede confirmação
#   -h, --help       ajuda
#
# Configuração: copie .deploy.env.example para .deploy.env e preencha.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# ---------- cores / log ----------
if [[ -t 1 ]]; then
  C_RESET=$'\e[0m'; C_GREEN=$'\e[32m'; C_YELLOW=$'\e[33m'; C_RED=$'\e[31m'; C_BLUE=$'\e[34m'; C_BOLD=$'\e[1m'
else
  C_RESET=; C_GREEN=; C_YELLOW=; C_RED=; C_BLUE=; C_BOLD=
fi
info() { printf '%s›%s %s\n' "$C_BLUE" "$C_RESET" "$*"; }
ok()   { printf '%s✔%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn() { printf '%s!%s %s\n' "$C_YELLOW" "$C_RESET" "$*" >&2; }
die()  { printf '%s✖%s %s\n' "$C_RED" "$C_RESET" "$*" >&2; exit 1; }
step() { printf '\n%s== %s ==%s\n' "$C_BOLD" "$*" "$C_RESET"; }

usage() { sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'; exit 0; }

# ---------- argumentos ----------
TARGET="all"; DRY_RUN=0; ASSUME_YES=0; COMMIT_MSG=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    all|github|hostinger) TARGET="$1" ;;
    -n|--dry-run) DRY_RUN=1 ;;
    -y|--yes) ASSUME_YES=1 ;;
    -m|--message) shift; COMMIT_MSG="${1:-}"; [[ -n "$COMMIT_MSG" ]] || die "--message precisa de um texto" ;;
    -h|--help) usage ;;
    *) die "argumento desconhecido: $1 (use --help)" ;;
  esac
  shift
done

# ---------- configuração ----------
[[ -f .deploy.env ]] && { set -a; source .deploy.env; set +a; }

GIT_REMOTE="${GIT_REMOTE:-origin}"
GIT_BRANCH="${GIT_BRANCH:-main}"
HOSTINGER_METHOD="${HOSTINGER_METHOD:-ssh}"   # ssh | ftp
HOSTINGER_PORT="${HOSTINGER_PORT:-}"
HOSTINGER_DELETE="${HOSTINGER_DELETE:-1}"     # 1 = apaga no servidor o que não existe mais localmente

# Arquivos que nunca vão para a Hostinger
# (excluídos também ficam protegidos contra o --delete no servidor)
EXCLUDES=(.git .github .gitignore .deploy.env .deploy.env.example deploy.sh README.md LICENSE .DS_Store node_modules .htaccess .well-known .user.ini)

confirm() {
  [[ $ASSUME_YES -eq 1 || $DRY_RUN -eq 1 ]] && return 0
  read -r -p "$1 [s/N] " r
  [[ "$r" =~ ^[sSyY]$ ]]
}

# ---------- GitHub Pages ----------
deploy_github() {
  step "GitHub Pages"
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "não é um repositório git"

  local current; current="$(git rev-parse --abbrev-ref HEAD)"
  [[ "$current" == "$GIT_BRANCH" ]] || die "você está em '$current'; o Pages publica '$GIT_BRANCH'. Faça checkout antes."

  if [[ -n "$(git status --porcelain)" ]]; then
    warn "há alterações não commitadas:"
    git status --short
    if [[ $DRY_RUN -eq 1 ]]; then
      info "(dry-run) seriam commitadas com: ${COMMIT_MSG:-chore: deploy $(date +%F)}"
    elif confirm "Commitar tudo e continuar?"; then
      git add -A
      git commit -q -m "${COMMIT_MSG:-chore: deploy $(date '+%F %H:%M')}"
      ok "commit criado"
    else
      die "deploy cancelado"
    fi
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    git fetch -q "$GIT_REMOTE" "$GIT_BRANCH" || true
    info "(dry-run) commits que seriam enviados:"
    git log --oneline "$GIT_REMOTE/$GIT_BRANCH..HEAD" || true
    return
  fi

  git push "$GIT_REMOTE" "$GIT_BRANCH"
  ok "enviado para $GIT_REMOTE/$GIT_BRANCH — o Pages atualiza em ~1 min"
  if [[ -n "${GITHUB_PAGES_URL:-}" ]]; then info "$GITHUB_PAGES_URL"; fi
}

# ---------- Hostinger ----------
require_vars() {
  local v missing=()
  for v in "$@"; do [[ -n "${!v:-}" ]] || missing+=("$v"); done
  [[ ${#missing[@]} -eq 0 ]] || die "faltando no .deploy.env: ${missing[*]}"
}

deploy_hostinger_ssh() {
  command -v rsync >/dev/null || die "rsync não instalado"
  require_vars HOSTINGER_HOST HOSTINGER_USER HOSTINGER_PATH
  local port="${HOSTINGER_PORT:-65002}"
  local args=(-avz --human-readable --itemize-changes)
  [[ $HOSTINGER_DELETE -eq 1 ]] && args+=(--delete)
  [[ $DRY_RUN -eq 1 ]] && args+=(--dry-run)
  local e; for e in "${EXCLUDES[@]}"; do args+=(--exclude "$e"); done

  info "rsync → $HOSTINGER_USER@$HOSTINGER_HOST:$HOSTINGER_PATH (porta $port)"
  rsync "${args[@]}" -e "ssh -p $port ${HOSTINGER_SSH_KEY:+-i $HOSTINGER_SSH_KEY}" \
    ./ "$HOSTINGER_USER@$HOSTINGER_HOST:${HOSTINGER_PATH%/}/"
}

deploy_hostinger_ftp() {
  command -v lftp >/dev/null || die "lftp não instalado (apt install lftp / brew install lftp)"
  require_vars HOSTINGER_HOST HOSTINGER_USER HOSTINGER_PASSWORD HOSTINGER_PATH
  local port="${HOSTINGER_PORT:-21}"
  local mirror="mirror --reverse --verbose --parallel=4 --only-newer"
  [[ $HOSTINGER_DELETE -eq 1 ]] && mirror+=" --delete"
  [[ $DRY_RUN -eq 1 ]] && mirror+=" --dry-run"
  local e; for e in "${EXCLUDES[@]}"; do mirror+=" --exclude-glob $e"; done

  info "FTP → $HOSTINGER_HOST:$HOSTINGER_PATH (porta $port)"
  # senha via variável de ambiente para não aparecer na lista de processos
  LFTP_PASSWORD="$HOSTINGER_PASSWORD" lftp -p "$port" --env-password -u "$HOSTINGER_USER" "$HOSTINGER_HOST" <<EOF
set ftp:ssl-allow yes
set ssl:verify-certificate no
set net:max-retries 2
$mirror ./ ${HOSTINGER_PATH%/}/
bye
EOF
}

deploy_hostinger() {
  step "Hostinger ($HOSTINGER_METHOD)"
  [[ -f .deploy.env ]] || die "crie o .deploy.env (veja .deploy.env.example)"
  [[ $HOSTINGER_DELETE -eq 1 && $DRY_RUN -eq 0 ]] && \
    warn "HOSTINGER_DELETE=1: arquivos remotos que não existem aqui serão apagados de $HOSTINGER_PATH"
  confirm "Publicar na Hostinger?" || die "deploy cancelado"
  case "$HOSTINGER_METHOD" in
    ssh) deploy_hostinger_ssh ;;
    ftp) deploy_hostinger_ftp ;;
    *) die "HOSTINGER_METHOD inválido: $HOSTINGER_METHOD (use ssh ou ftp)" ;;
  esac
  if [[ $DRY_RUN -eq 1 ]]; then ok "dry-run concluído (nada enviado)"; else ok "Hostinger atualizada"; fi
  if [[ -n "${HOSTINGER_URL:-}" ]]; then info "$HOSTINGER_URL"; fi
}

# ---------- main ----------
[[ $DRY_RUN -eq 1 ]] && warn "modo dry-run: nada será enviado"
case "$TARGET" in
  github)    deploy_github ;;
  hostinger) deploy_hostinger ;;
  all)       deploy_github; deploy_hostinger ;;
esac
printf '\n%sPronto.%s\n' "$C_GREEN" "$C_RESET"
