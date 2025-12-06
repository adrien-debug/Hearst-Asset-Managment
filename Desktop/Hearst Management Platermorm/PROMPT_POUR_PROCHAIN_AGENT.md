# Prompt pour le Prochain Agent

## Ce qui a été fait

Une harmonisation CSS complète a été effectuée sur **18 fichiers CSS** pour aligner toutes les pages avec le style de la page overview (`app/page.module.css`).

### Modifications principales

1. **Headers de page** (10 fichiers) : margin, padding, background, border-bottom harmonisés
2. **Titres de page** (10 fichiers) : font-size `1.75rem`, font-weight `500`, color `var(--color-text-heading)`, letter-spacing `0.01em`
3. **Sous-titres** (10 fichiers) : font-size `0.8125rem`, letter-spacing `0.005em`
4. **Titres de section** (7 fichiers) : font-size `1rem`, font-weight `500`, color `var(--color-text-heading)`, letter-spacing `0.01em`
5. **Media queries** : breakpoints harmonisés (1024px, 768px, 480px) avec valeurs cohérentes

### Fichiers modifiés

**Headers/Titres/Sous-titres :**
- `components/admin/AdminDashboard.module.css`
- `app/admin/product-factory/page.module.css`
- `components/execution/ExecutionsTable.module.css`
- `components/execution/ExecutionDetail.module.css`
- `components/mandates/MandatesTable.module.css`
- `components/mandates/MandateDetail.module.css`
- `components/products/ProductShelfHorizontal.module.css`
- `components/products/ProductHeader.module.css`
- `components/reports/ReportsTable.module.css`
- `components/risk/RiskComplianceDashboard.module.css`

**Titres de section :**
- `components/admin/AdminDashboard.module.css`
- `components/execution/ExecutionDetail.module.css`
- `components/mandates/MandateDetail.module.css`
- `components/products/ProductDetailMarket.module.css`
- `components/risk/RiskComplianceDashboard.module.css`
- `components/admin/ProductFactoryForm.module.css`
- `components/products/MiningIntegrationBlock.module.css`

**Autres :**
- `components/overview/GeographicDistribution.module.css`

### Style de référence

Voir `app/page.module.css` pour le style de référence. Tous les headers, titres et sous-titres doivent suivre exactement ce modèle.

### État final

- ✅ 0 erreur de linting
- ✅ Toutes les pages harmonisées
- ✅ Design system unifié
- ✅ Responsive cohérent

### Note importante

Les styles de tableaux, cartes de résumé, filtres, badges et boutons n'ont PAS été modifiés car ils étaient déjà cohérents ou nécessitent des styles spécifiques pour leur fonction.

