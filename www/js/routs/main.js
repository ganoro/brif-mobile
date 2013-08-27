(function(){
    brif.router.route('main', "main", function() {
        brif.models.signIn.setApiKey();
        console.log('route:main');
        $.get('sample_data/all_docs.json', function(response){
            var docs = response;
            var count = docs.length;
            _.each(docs, function(doc, index, docs){
                switch(doc.type) {
                case 'contact':
                    brif.collections.contacts.add(doc);
                    break;
                case 'thread':
                    brif.collections.threads.add(doc);
                    break;
                case 'message':
                    brif.collections.messages.add(doc);
                    break;
                case 'user':
                    brif.models.user.set(doc);
                    break;
                default:
                    console.warn("%c%s %o", "color:blue", 'document of unknown type :', doc.type);
                    break;
                }
                count--;
                if(count == 0) {
                    console.log("%c%s", "color:blue", 'all documents are ready');
                    renderApp();
                }
            });
        }).fail(function(response){
            console.error(response);
        });
        
        function renderApp() {
            //system layout
            brif.views.systemLayout = new brif.viewClass.systemLayout();
            brif.views.systemLayout.render();
            
            //thread list
            brif.views.threadDock= new brif.viewClass.threadDock();
            $('.system_layout.threads').append(brif.views.threadDock.render().el);
            var firstChannel = brif.collections.threads.first().get('channel_id');
            _.each(brif.collections.threads.models, function(threadModel, index, threads){
                var threadView = new brif.viewClass.thread({model: threadModel});
                var $dock = brif.views.threadDock.$('.thread_list');
                $dock.append(threadView.render().el);
            });
        }
    });
})();
