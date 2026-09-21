let title = document.getElementById("title");
let desc = document.getElementById("desc");
let btn = document.getElementById("addBtn"); 
let list = document.getElementById("list");
  
let tasks = [];


function loadTasks() { 

    fetch("/api/tasks") 
    .then(function (response){
         return response.json(); 
    })
    .then(function (data){
         tasks = data;
         console.log(tasks);
         showTasks(); 
    });

}


function showTasks() {
 
    list.innerHTML = "";

    tasks.forEach(function (item, index) {

        let task = document.createElement("div");
        task.className = "border p-3 rounded mt-3 bg-gray-100";

        task.innerHTML = `
            <h2 class="text-lg font-bold">${item.title}</h2>
            <p class="mt-1">${item.desc}</p>

            <button class="deleteBtn bg-red-500 text-white px-3 py-1 rounded mt-3">
                Delete
            </button>

            <button class="editBtn bg-blue-500 text-white px-3 py-1 rounded mt-3">
                Edit
            </button>
        `;



        task.querySelector(".deleteBtn").onclick = function () {

            Swal.fire({
                title: "Delete Task?",
                text: "You won't be able to recover it!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#111827",
                cancelButtonColor: "#111827",
                confirmButtonText: "Yes, Delete"
            }).then((result) => {

                if (result.isConfirmed) {

                    fetch("/api/tasks/" + item.id, {
                        method: "DELETE"
                    })
                    .then(function (response){
                        return response.json();
                    })
                    .then(function (data){

                        console.log(data);

                        loadTasks();

                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Task deleted successfully.",
                            timer: 1200,
                            showConfirmButton: false
                        });

                    });

                }

            });

        };


task.querySelector(".editBtn").onclick = function () {

    Swal.fire({
        title: "Edit Task",
        html: `
            <input id="editTitle" class="swal2-input" placeholder="Task Title" value="${item.title}">
            <textarea id="editDesc" class="swal2-textarea" placeholder="Task Description">${item.desc}</textarea>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#111827",
        cancelButtonColor: "#111827",
        focusConfirm: false,

        preConfirm: () => {

            let newTitle = document.getElementById("editTitle").value.trim();
            let newDesc = document.getElementById("editDesc").value.trim();

            if (newTitle === "" || newDesc === "") {
                Swal.showValidationMessage("Please fill all fields!");
                return false;
            }

            return {
                title: newTitle,
                desc: newDesc
            };
        }

    }).then((result) => {

        if (result.isConfirmed) {

            fetch("/api/tasks/" + item.id, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: result.value.title,
                    desc: result.value.desc
                })
            })
            .then(function (response){
                return response.json();
            })
            .then(function (data){

                console.log(data);

                loadTasks();

                Swal.fire({
                    icon: "success",
                    title: "Task Updated!",
                    text: "Your task has been updated successfully.",
                    timer: 1500,
                    showConfirmButton: false
                });

            });

        }

    });

};

        list.appendChild(task);

    });

}

btn.onclick = function () {

    if (title.value.trim() === "" || desc.value.trim() === "") {
    Swal.fire({
    icon: "info",
    title: "Almost There! 🚀",
    text: "Don't forget to fill in both the Title and Description.",
    confirmButtonText: "I'll do it",
    confirmButtonColor: "#111827"
});
        return;
    }

    fetch("/api/tasks", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title.value,
            desc: desc.value
        })

    })
    .then(function (response){
        return response.json();
    })
    .then(function (data){

        console.log(data);

        Swal.fire({
            icon: "success",
            title: "Task Added!",
            text: "Your task has been added successfully.",
            timer: 1500,
            showConfirmButton: false
        });

        title.value = "";
        desc.value = "";

        loadTasks();

    });

};


loadTasks();