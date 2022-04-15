function(properties, context) {
    
	const fetch = require('node-fetch');
    
    const body = {
        "provider": context.keys.provider,
        "channel_key": context.keys.channel_key,
        "from": properties.from,
        "name": properties.name,
        "text": properties.text,
    };
    
    return context.async(cb => {
        fetch("https://api.sociocs.com/incoming", {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "apikey": context.keys.api_key,
            }
        }).then(res => {
            return res.json();
        }).then(response => {
            if(response.status === "success") {
                return cb(undefined, response);
            } else {
                return cb(JSON.stringify(response.errors));
            }
        }).catch(err => {
            return cb(err);
        });
    });

}