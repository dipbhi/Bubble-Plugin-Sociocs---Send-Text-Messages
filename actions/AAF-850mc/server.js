function(properties, context) {
    
	const fetch = require('node-fetch');
    
    const body = {
        "provider": context.keys.provider,
        "channel_key": context.keys.channel_key,
        "to": properties.to,
        "name": properties.name,
        "text": properties.text,
        "image_url": properties.image_url,
        "file_url": properties.file_url
    };
    
    if(properties.image_urls && properties.image_urls.length()) {
        body.image_urls = properties.image_urls.get(0, properties.image_urls.length()).map(x => x.startsWith("//") ? "https:" + x : x);
    }
    
    if(!body.text && !body.image_url && !body.image_urls && !properties.image_urls.length() && !body.file_url){
        return "At least one of these must be provided: Text, Image URL, Image URLs, File URL.";
    }
    
    if(body.image_url && body.image_url.startsWith("//")){
        body.image_url = "https:" + body.image_url;
    }
    
    if(body.file_url && body.file_url.startsWith("//")){
        body.file_url = "https:" + body.file_url;
    }
        
    return context.async(async cb => {
       
        try {
            const res = await fetch("https://api.sociocs.com/message", {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "apikey": context.keys.api_key,
                }
            });

            const response = await res.json();

            if(response.status === "success") {
                return cb(undefined, response);
            } else {
                console.error(JSON.stringify(response.errors));
                return cb(JSON.stringify(response.errors));
            }
        } catch(err) {
            console.error(err);
            return cb(err);
        }
        
    });

}