/* eslint-disable @typescript-eslint/no-unused-vars */
function deleteItem(id) {
    const url = id.split(",");
    url[0] = url[0].replace("[", "");
    url[1] = url[1].replace(" ", "");
    url[2] = url[2].replace(" ", "");
    url[2] = url[2].replace("]", "");
    fetch(`http://${url[0]}:${url[1]}/api/delete/${url[2]}`, {
        method: 'DELETE',
    }).then((response) => {
        if (response.ok) {
            location.reload();
        } 
    });
}

