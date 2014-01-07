var profile = (function(){
    return {
        basePath: "./js/",
        releaseDir: "./src-all",
        action: "release",
        mini: true,
        selectorEngine: "lite",
 
        defaultConfig: {
            hasCache:{
                "dojo-built": 1,
                "dojo-loader": 1,
                "dom": 1,
                "host-browser": 1,
                "config-selectorEngine": "lite"
            },
            async: 1
        },
 
        packages:[{
            name: "dojo",
            location: "lib/dojo"
        },{
            name: "dijit",
            location: "lib/dijit"
        },{
            name: "src",
            location: "src"
        }],
 
        layers: {
            "dojo/dojo": {
                include: [ "dojo/dojo"],
                customBase: true,
                boot: true
            },
            "src/FormLogic": {
                include: [ 
                    "src/Matrix", 
                    "src/Checkboxes", 
                    "src/_BaseClass", 
                    "src/OptionPanel",
                    "src/_FormWidgetBase",
                    "src/_Rule",
                    "src/Dropdown",
                    "src/MultipleChoice",
                    "src/Reg",
                    "src/Selector"]
            }
        }
    };
})();