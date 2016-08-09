subtreePull:
	@git subtree pull --prefix=wp-content/plugins/wp-property git@github.com:wp-property/wp-property latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-feps git@github.com:wp-property/wp-property-feps latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-importer git@github.com:wp-property/wp-property-importer latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-supermap git@github.com:wp-property/wp-property-supermap latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-agents git@github.com:wp-property/wp-property-agents latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-availability git@github.com:wp-property/wp-property-availability latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-walkscore git@github.com:wp-property/wp-property-walkscore latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-terms git@github.com:wp-property/wp-property-terms latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-slideshow git@github.com:wp-property/wp-property-slideshow latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-pdf git@github.com:wp-property/wp-property-pdf latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-power-tools git@github.com:wp-property/wp-property-power-tools latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-property-responsive-slideshow git@github.com:wp-property/wp-property-responsive-slideshow latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-rets-client git@github.com:UsabilityDynamics/wp-rets-client latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-stateless git@github.com:wpCloud/wp-stateless latest --squash
	@git subtree pull --prefix=wp-content/plugins/wp-upstream git@github.com:wpCloud/wp-upstream latest --squash


subtreePush:
	@git subtree push --prefix=wp-content/themes/wp-avalon git@github.com:wp-property/wp-avalon latest --squash
	@git subtree push --prefix=wp-content/themes/wp-denali git@github.com:wp-property/wp-denali latest --squash
	@git subtree push --prefix=wp-content/themes/wp-madison git@github.com:wp-property/wp-madison latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-github-wiki git@github.com:UsabilityDynamics/wp-github-wiki latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property git@github.com:wp-property/wp-property latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-feps git@github.com:wp-property/wp-property-feps latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-importer git@github.com:wp-property/wp-property-importer latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-supermap git@github.com:wp-property/wp-property-supermap latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-agents git@github.com:wp-property/wp-property-agents latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-availability git@github.com:wp-property/wp-property-availability latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-walkscore git@github.com:wp-property/wp-property-walkscore latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-terms git@github.com:wp-property/wp-property-terms latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-slideshow git@github.com:wp-property/wp-property-slideshow latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-pdf git@github.com:wp-property/wp-property-pdf latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-facebook-tabs git@github.com:wp-property/wp-property-facebook-tabs latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-power-tools git@github.com:wp-property/wp-property-power-tools latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-property-responsive-slideshow git@github.com:wp-property/wp-property-responsive-slideshow latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-rets-client git@github.com:UsabilityDynamics/wp-rets-client latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-invoice git@github.com:wp-invoice/wp-invoice latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-invoice-mijireh-checkout git@github.com:wp-invoice/wp-invoice-mijireh-checkout latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-stateless git@github.com:wpCloud/wp-stateless latest --squash
	@git subtree push --prefix=wp-content/plugins/wp-upstream git@github.com:wpCloud/wp-upstream latest --squash

subtreeAdd:
	@git subtree add --prefix=wp-content/themes/wp-avalon git@github.com:wp-property/wp-avalon latest
	@git subtree add --prefix=wp-content/themes/wp-denali git@github.com:wp-property/wp-denali latest
	@git subtree add --prefix=wp-content/themes/wp-madison git@github.com:wp-property/wp-madison latest
	@git subtree add --prefix=wp-content/plugins/wp-github-wiki git@github.com:UsabilityDynamics/wp-github-wiki latest
	@git subtree add --prefix=wp-content/plugins/wp-property git@github.com:wp-property/wp-property latest
	@git subtree add --prefix=wp-content/plugins/wp-property-feps git@github.com:wp-property/wp-property-feps latest
	@git subtree add --prefix=wp-content/plugins/wp-property-importer git@github.com:wp-property/wp-property-importer latest
	@git subtree add --prefix=wp-content/plugins/wp-property-supermap git@github.com:wp-property/wp-property-supermap latest
	@git subtree add --prefix=wp-content/plugins/wp-property-agents git@github.com:wp-property/wp-property-agents latest
	@git subtree add --prefix=wp-content/plugins/wp-property-availability git@github.com:wp-property/wp-property-availability latest
	@git subtree add --prefix=wp-content/plugins/wp-property-walkscore git@github.com:wp-property/wp-property-walkscore latest
	@git subtree add --prefix=wp-content/plugins/wp-property-terms git@github.com:wp-property/wp-property-terms latest
	@git subtree add --prefix=wp-content/plugins/wp-property-slideshow git@github.com:wp-property/wp-property-slideshow latest
	@git subtree add --prefix=wp-content/plugins/wp-property-pdf git@github.com:wp-property/wp-property-pdf latest
	@git subtree add --prefix=wp-content/plugins/wp-property-facebook-tabs git@github.com:wp-property/wp-property-facebook-tabs latest
	@git subtree add --prefix=wp-content/plugins/wp-property-power-tools git@github.com:wp-property/wp-property-power-tools latest
	@git subtree add --prefix=wp-content/plugins/wp-property-responsive-slideshow git@github.com:wp-property/wp-property-responsive-slideshow latest
	@git subtree add --prefix=wp-content/plugins/wp-rets-client git@github.com:UsabilityDynamics/wp-rets-client latest
	@git subtree add --prefix=wp-content/plugins/wp-invoice git@github.com:wp-invoice/wp-invoice latest
	@git subtree add --prefix=wp-content/plugins/wp-invoice-mijireh-checkout git@github.com:wp-invoice/wp-invoice-mijireh-checkout latest
	@git subtree add --prefix=wp-content/plugins/wp-stateless git@github.com:wpCloud/wp-stateless latest
	@git subtree add --prefix=wp-content/plugins/wp-upstream git@github.com:wpCloud/wp-upstream latest