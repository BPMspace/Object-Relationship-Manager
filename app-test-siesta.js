var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title       : 'ORM Manager Unit Testing',
	loaderPath  : { 'Rob' : 'app' },
    preload     : [
        // version of ExtJS used by your application
        'extjs/resources/css/ext-all.css',
       // '../resources/yourproject-css-all.css',

        // version of ExtJS used by your application
        'extjs/ext-all-debug.js',
        'app.js'
    ]
});

Harness.start(
 //'tests/startup.js',
	
		{
        group               : 'Models',
        items               : [
            'unit_ui_test/tests_siesta/tests/02_test_object_model.js',
            //'unit_ui_test/tests_siesta/tests/03_test_attribute_model.js',
           // 'unit_ui_test/tests_siesta/tests/04_test_relation_model.js',
            //'unit_ui_test/tests_siesta/tests/05_test_roblist_model.js'


        ]
    },
    //'startup.js',
	 {
        group               : 'Application',
        
        // need to set the `preload` to empty array - to avoid the double loading of dependencies
        preload             : [],
        
        items : [
            {
                hostPageUrl         : 'index2.html',
                url                 : 'unit_ui_test/tests_siesta/tests/01_startup.js'
            }
        ]
    }

);