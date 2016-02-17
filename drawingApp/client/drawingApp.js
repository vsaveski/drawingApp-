'use strict';

Router.configure({
  layoutTemplate: 'applicationLayout'
});

Router.route('/', {
    name:   'home',
    action: function action() {
        this.render('intro');
        this.render('footer', {to: 'footer'});
    }
});

Router.route('/machine', {
    name:   'machine',
    action: function action() {
        this.render('wall');
        this.render('footer', {to: 'footer'});
    }
});

Router.route('/about', {
    name:   'about',
    action: function action() {
        this.render('about');
        this.render('footer', {to: 'footer'});
    }
});
