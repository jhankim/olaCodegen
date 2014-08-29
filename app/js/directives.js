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


// Slideable
codegenApp.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})
.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            element.bind('click', function() {
                var content = target.querySelector('.slideable_content');
                if(!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
});
