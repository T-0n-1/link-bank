document.querySelectorAll('.link_list_item').forEach(item => {    
    item.addEventListener('click', event => {
        console.log(event);
    });
});