Page = function() {};
Page.prototype.setpage = function(maxrow, limit, page, callback) {
    var firstrow = lastrow = maxpage = 0;
    maxpage = Math.ceil(maxrow / limit);
    console.log('maxrow=', maxrow, 'limit=', limit, 'page=', page, 'maxpage=', maxpage);
    if (maxrow > limit && page > 1) {
        firstrow = (page - 1) * limit;
        lastrow = page * limit
    } else if (!page || page == 1) {
        firstrow = 1;
        lastrow = 20
    } else if (maxrow < limit) {
        firstrow = 1;
        lastrow = 20
    }
    callback(firstrow, lastrow, maxpage);
};

module.exports = Page;