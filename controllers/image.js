import 'dotenv/config';
   // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = process.env.CF_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.CF_USER_ID;
    const APP_ID = process.env.CF_APP_ID; 
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = process.env.CF_MODEL_ID;
    const MODEL_VERSION_ID = process.env.CF_MODEL_VERSION_ID;

const handleApiCall = (req, res) => {
    const IMAGE_URL = req.body.input;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(data => {res.json(data)})
    .catch(err => res.status(400).json('unable to work with API'))
}
        

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))

}
export {handleImage
    ,handleApiCall
    };