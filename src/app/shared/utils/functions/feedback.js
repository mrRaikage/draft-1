export function startSurveySparrow() {
    var e = "ss-widget", t = "script", a = document, r = window;
    var s, n, c;

    r.SS_WIDGET_TOKEN = "tt-c05e56";
    r.SS_ACCOUNT = "bothworlds.surveysparrow.com";
    r.SS_SURVEY_NAME = "norder-feedback";

    var S = function() {
        S.update(arguments);
    };
    S.args = [];
    S.update = function(e) {
        S.args.push(e);
    };
    r.SparrowLauncher = S;
    s = a.getElementsByTagName(t);
    c = s[s.length - 1];
    n = a.createElement(t);
    n.type = "text/javascript";
    n.async = !0;
    n.id = e;
    n.src = ["https://", "bothworlds.surveysparrow.com/widget/", r.SS_WIDGET_TOKEN].join("");
    c.parentNode.insertBefore(n, c);
}
