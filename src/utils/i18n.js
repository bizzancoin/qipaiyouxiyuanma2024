export function generateTitle(title) {
  return this.$t('route.' + title) // $t :this method from vue-i18n ,inject in @/lang/index.js
}
