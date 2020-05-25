function makeAPICall(url: string, body: object = {}) {
    return new Promise ((resolve, reject) => {
        fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            }
        )
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                resolve(res.json());
                return;
            } else if (res.status === 504) {
                window.location.replace("/login");
            }

            reject(res);
        });
    });
}

export {
    makeAPICall
};
