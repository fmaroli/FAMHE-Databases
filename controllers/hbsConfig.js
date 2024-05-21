var dateFns = require('date-fns');

const Configuration = {
    defaultLayout: "main"
    , extname: ".handlebars"
    , helpers: {
        section: function (name) {
            var sections = this._sections,
                content = sections && sections[name];

            return content ? content.join('\n') : null;
        }
        , contentFor: function (name, options) {
            var sections = this._sections || (this._sections = {}),
                section = sections[name] || (sections[name] = []);

            section.push(options.fn(this));
        }
        , find: function (items, key, value) {
            for (let index in items) {
                if (items[index][key] === value) {
                    return items[index];
                }
            }
        }
        , formatDate: function (dateTime, format) {
            if (!dateTime) {
                return dateTime;
            }

            var localDate = new Date(Date.parse(dateTime));

            if (typeof (format) !== "string") {
                format = null;
            }

            format = format || process.env.APP_DEFAULT_DATE_FORMAT;

            if (localDate) {
                if (dateFns) {
                    return dateFns.format(localDate, format);
                } else {
                    return localDate.toDateString();
                }
            } else {
                return dateTime;
            }
        }
        , plusValue: function (value, addition) {
            return value + addition;
        }
        , equal: function (expression, value) {
            if (expression == value) {
                return true;
            }
        }
        , isChecked: function (column) {
            if (Boolean(column)) {
                return "checked";
            }
        }
        , isCheckedInArray: function (expression, value) {
            if (expression) {
                for (let index = 0; index < expression.length; index++) {
                    if (expression[index] == value) {
                        return "checked";
                    }
                }
            }
        }
        , isSelected: function (expression, value) {
            if (expression == value) {
                return "selected";
            }
        }
        , substring: function (value, start, length, rightLength) {
            if (!value) {
                return value;
            }

            if (rightLength && rightLength == true) {
                let clen = value.length;
                return value.substring(clen - length, length);
            } else {
                return value.substring(start, length);
            }
        }
        , geq: function (v1, v2, options) {
            if (v1 >= v2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }, showRating: function (rating) {
            let res = '<span class="star-icons">';
            for (let i = 0; i < 5; i++) {
                if (rating > i) {
                    res += '<span><img class="rateImage" src="/images/star-fill.svg"></span>';
                } else {
                    res += '<span><img class="rateImage" src="/images/star.svg"></span>';
                }
            }
            res += '</span>';
            return res;
        }
    }
}

exports.Configuration = Configuration;
