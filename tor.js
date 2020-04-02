function checktor() {
    var onion = "http://3oddt2t3lmgpfzhbdzkyfqe2hk3nuhs2zoy6cosrgo7kkdhmmionnsqd.onion/ghcheck";
    var ondump = function(data) {
        console.log(data);
        document.body.innerHTML += data;
    }
    jQuery.ajax({ url: onion, success: ondump });
}
