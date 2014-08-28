'use strict';

/* Directives */
codegenApp.directive('olapicWidget', ['AuthKeys', function(AuthKeys) {
 
  return {
    restrict: 'A',
    template: '<div id="olapicWidget"><div class="olapic-loading"></div></div>',
    scope: { data: '=' },
    link: function(scope, element, attr) {
 
      waitForOlapic();
 
      function waitForOlapic() {
        if(typeof OlapicSDK !== 'undefined') {
            renderOlapic();
        }
        else
        {
            setTimeout(function() {
                waitForOlapic();
            }, 250);
        }
      };
 
      function renderOlapic() {
 
        OlapicSDK.conf.set('apikey', AuthKeys.olapic);
        
        if(attr.mode) {
          OlapicSDK.conf.set('mode', attr.mode);
        }
 
          function onOlapicLoad() {
 
            if( typeof window.olapic == 'undefined') {
 
            window.olapic = new OlapicSDK.Olapic( function(o){
                    window.olapic = o;
                    renderWidget({
                        'id': attr.instance,
                        'wrapper': attr.target
                    });
                });
 
            } else {
 
                    renderWidget({
                        'id': attr.instance,
                        'wrapper': attr.target
                    });
 
            }
 
          };
 
          function renderWidget(options) {
 
              var settings = {
                  wrapper: options.wrapper,
                  id : options.id,
                  tags : options.tags,
                  useOpi : false
              };
 
              window.olapic.prepareWidget(settings, {
                  'renderNow' : true,
                  'force' : true
              });
 
          }
 
          onOlapicLoad();
 
        };
 
    }
  };
 
}]);