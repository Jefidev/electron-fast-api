function hello() {
    let formInfo = document.getElementById('inputName').value;
    console.log(formInfo);
    window.apiBridge.hello(formInfo);
}