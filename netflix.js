var url_info = location.pathname.split('/');

function activateButton(cls) {
    jQuery('.watchlistbtn').css('display', 'none');
    jQuery('.watchlistbtn.' + cls).css('display', 'inline');
}

function buttonsTemplate() {
    return '<a id="addWatchlistBtn" class="add-to-watchlist watchlistbtn" style="display: none;">Add to watchlist</a>' +
           '<a id="removeWatchlistBtn" class="remove-from-watchlist watchlistbtn" style="display: none;">Remove from watchlist</a>'
}

function getStatus(message) {
    if (message.name == 'isEntityAddedAnswer') {
        if (message.message) {
            jQuery('.watchlistbtn.remove-from-watchlist').css('display', 'inline');
        } else {
            jQuery('.watchlistbtn.add-to-watchlist').css('display', 'inline');
        }
    }
}

safari.self.addEventListener("message", getStatus, false);

if (url_info.length == 4) {
    var entity_type = url_info[1],
        entity_name = jQuery('#displaypage-overview-details .title-wrapper h1').text(),
        entity_img = jQuery('#displaypage-overview-image .boxShot img.boxShotImg').attr('src'),
        entity_id = parseInt(url_info[3], 10),
        entity_url = location.pathname;

    if (entity_id > 0) {
        jQuery('#displaypage-overview-details .title-wrapper').append(buttonsTemplate());

        jQuery('#displaypage-overview-details .add-to-watchlist').bind('click', function() {
            activateButton('remove-from-watchlist');
            safari.self.tab.dispatchMessage('watchlistStore', {
                key: entity_id,
                data: { name: entity_name, img: entity_img, url: entity_url }
            });
        });

        jQuery('#displaypage-overview-details .remove-from-watchlist').bind('click', function() {
            activateButton('add-to-watchlist');
            safari.self.tab.dispatchMessage('watchlistRemove', entity_id);
        });

        safari.self.tab.dispatchMessage("isEntityAdded", entity_id);
    }

}

var popupContent = jQuery('#BobMovie-content');
if (popupContent) {
    //var title = popupContent.find('span.title');
    console.log('listening to changed on ', popupContent);
    popupContent.bind("DOMNodeInserted", function(event) {
        if (event.target.id == 'addWatchlistBtn' || event.target.id == 'removeWatchlistBtn') return;

        popupContent.find('span.title').after(buttonsTemplate());

        var entity_url = popupContent.find('.bobMovieContent a.readMore').attr('href'),
            entity_id = /\/([0-9]+)\?/.exec(entity_url)[1],
            entity_name = popupContent.find('span.title a').text(),
            entity_img = '';

        var entity_img_el = $('span#dbs' + entity_id + '_0 img');
        if (entity_img_el) {
            entity_img = entity_img_el.attr('src');
        }


        popupContent.find('.add-to-watchlist').bind('click', function() {
            activateButton('remove-from-watchlist');
            safari.self.tab.dispatchMessage('watchlistStore', {
                key: entity_id,
                data: { name: entity_name, img: entity_img, url: entity_url }
            });
        });

        popupContent.find('.remove-from-watchlist').bind('click', function() {
            activateButton('add-to-watchlist');
            safari.self.tab.dispatchMessage('watchlistRemove', entity_id);
        });

        safari.self.tab.dispatchMessage("isEntityAdded", entity_id);
    });
}
