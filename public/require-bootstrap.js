requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        bower: 'bower_components',
        jquery: 'bower_components/jquery/dist/jquery.min'
    },
    packages:[{
        name:'FileSaver.js',
        location: 'bower_components/file-saver/',
        main: 'FileSaver'
    }]

});

require(['app'],function(app){

});

