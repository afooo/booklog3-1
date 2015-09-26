var app = app || {};

app.Lessons = Backbone.Model.extend({
	url: function(){
		return '/learn/lessons'
	},
	defaults: {
		errors: [],
		errfor: {},
		lessons: []
	}
});

app.Lesson = Backbone.Model.extend({
	url: function(){
		return '/learn/lessons/' + this.attributes.id
	},
	id: '',
	defaults: {
		errors: [],
		errfor: {},
		lesson: {}
	}
});

app.ListView = Backbone.View.extend({
	el: '#tolearnlist',
	template: _.template( $('#tmpl-tolearnlist').html() ),
	events: {
		'click #lesson': 'listLesson',
		'click #add': 'add'
	},
	initialize: function(){
		this.model = new app.Lessons();
		
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
		this.model.fetch();
	},
	render: function(){
		this.$el.html(this.template(this.model.attributes));
	},
	listLesson: function(evt){
		var id = $(evt.target).data('id');

		app.lessonView.model.set('id', id);
		app.lessonView.model.fetch();
	},
	add: function(){

	}
});

app.LessonView = Backbone.View.extend({
	el: '#lessoninfo',
	template: _.template( $('#tmpl-lessonlearn').html() ),
	events: {
		'click .btn-edit': 'edit',
		'click .btn-save': 'save',
		'click .btn-cancel': 'cancel'
	},
	initialize: function(){
		this.model = new app.Lesson();
		this.listenTo(this.model, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		this.$el.html( this.template( this.model.attributes ));
	},
	edit: function(){
		this.$el.find('.non-editable').addClass('hide');
		this.$el.find('.editable').removeClass('hide');
	},
	save: function(){
		this.model.save({
			id: this.$el.find('[name=id').val(),
			lesson: {
				lessonName: this.$el.find('[name=lessonname]').val(),
				lessonUrl: this.$el.find('[name=lessonurl]').val(),
				lessonLearn: this.$el.find('[name=lessonlearn]').val()
			}
		});
		console.log('its saved');
	},
	cancel: function(){
		this.$el.find('.editable').addClass('hide');
		this.$el.find('.non-editable').removeClass('hide');		
	}
});

$(document).ready(function(){
	app.listView = new app.ListView();
	app.lessonView = new app.LessonView();
});

