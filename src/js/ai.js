export default class AI {
    constructor() { }



    async Query(text) {
        console.log(text)
        return "This is a placeholder response.";
    }

    stop() {
        this.ctrl?.abort();
    }
}
