var getFiles, sendMessage;

(function () {
    var ws, messageInput, msgTextInput;


    function openConnection() {
        ws = new WebSocket(`ws://${window.location.host}`);
        ws.onmessage = function (event) {
            messageInput.innerHTML = `<pre>${event.data}</pre>${messageInput.innerHTML}`;
        };
    }

    sendMessage = function () {
        if (!ws || ws.readyState !== 1) openConnection();

        ws.send(msgTextInput.value);
        msgTextInput.value = '';
    }

    getFiles = function (element) {
        var index = element.selectedIndex;
        let folder = element.children[index].value;

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function () {
            document.getElementById('tbody').innerHTML = this.responseText;
        });
        oReq.open("GET", `http://${window.location.host}/files/${btoa(folder)}`);
        oReq.send();
    }


    window.onload = function () {
        messageInput = document.getElementById('messages');
        msgTextInput = document.getElementById('msgBox');


        var first = document.querySelector('select');
        first && getFiles(first);

        openConnection();
    }

})();