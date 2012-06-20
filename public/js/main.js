/*global require*/

require.config({
  baseUrl : "/js/",

  paths : {
    jquery       : 'vendor/jquery-1.7.3',
    "underscore" : "vendor/underscore",
    "backbone"   : "vendor/backbone",
    "marionette" : "vendor/backbone.marionette-0.9.0"
  },

  use : {
    "underscore" : {
      attach : "_"
    },
    "backbone"   : {
      deps   : ["jquery", "underscore"],
      attach : function ($, _) {
        return Backbone;
      }
    },
    "marionette" : {
      deps   : ["jquery", "underscore", "backbone"],
      attach : function ($, _, Backbone) {
        return Backbone;
      }
    }
  }

});

require(['modules/application'], function (app) {
  "use strict";

  app.initialize();

});
