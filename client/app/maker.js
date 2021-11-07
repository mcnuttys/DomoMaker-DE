const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fiends are required!");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    })

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm" name="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="age" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="score">Score: </label>
            <input id="score" type="text" name="score" placeholder="Domo Score" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />

        </form>
    );
}

const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name}</h3>
                <h3 className="domoAge"> Age: {domo.age}</h3>
                <h3 className="domoScore"> Score: {domo.score}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            <h1>Local Domos</h1>
            {domoNodes}
        </div>
    );
}

const BestDomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        return (
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name}</h3>
                <h3 className="domoAge"> Age: {domo.age}</h3>
                <h3 className="domoScore"> Score: {domo.score}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            <h1>Top Domos</h1>
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        console.dir(data);

        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });

    sendAjax('GET', '/bestDomos', null, (data) => {
        console.dir(data);

        ReactDOM.render(
            <BestDomoList domos={data.domos} />, document.querySelector("#bestDomos")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    ReactDOM.render(
        <BestDomoList domos={[]} />, document.querySelector("#bestDomos")
    );

    loadDomosFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
})