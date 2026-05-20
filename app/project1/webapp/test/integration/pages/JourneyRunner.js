sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"project1/test/integration/pages/SuppliersList",
	"project1/test/integration/pages/SuppliersObjectPage"
], function (JourneyRunner, SuppliersList, SuppliersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('project1') + '/test/flp.html#app-preview',
        pages: {
			onTheSuppliersList: SuppliersList,
			onTheSuppliersObjectPage: SuppliersObjectPage
        },
        async: true
    });

    return runner;
});

