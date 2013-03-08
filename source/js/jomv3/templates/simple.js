// This file was automatically generated from simple.soy.
// Please don't edit this file by hand.

goog.provide('examples.simple');

goog.require('soy');
goog.require('soydata');


examples.simple.helloWorld = function(opt_data, opt_ignored) {
  return 'Hello ' + soy.$$escapeHtml(opt_data.name['firstName']) + ' ' + soy.$$escapeHtml(opt_data.name['lastName']) + '!' + soy.$$escapeHtml(BREAK) + 'You are ' + soy.$$escapeHtml(opt_data.age) + ' years old.';
};
