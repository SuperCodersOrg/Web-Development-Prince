console.log("Script loaded");

const mainDiv = document.getElementById("main-div");
document.addEventListener("click", function (event) {
    if (event.target.tagName !== "A") {
        return;
    }
    event.preventDefault();

    const route = event.target.getAttribute("href");

    if (route === "/") {
        mainDiv.innerHTML = `
            <h1 class="text-3xl font-bold mb-4">
                Welcome to ABC College
            </h1>

            <p class="text-gray-600">
                Welcome to ABC College Website.
            </p>
        `;

        return;
    }

    if (route === "/register") {
        mainDiv.innerHTML = `
            <h2 class="text-3xl font-bold mb-6">
                Student Registration
            </h2>

            <form id="register-form" class="max-w-md space-y-4">

                <input id="student-name" type="text" placeholder="Enter Name"class="w-full border p-3 rounded">

                <input id="student-course" type="text" placeholder="Enter Course" class="w-full border p-3 rounded">

                <input id="student-year" type="text" placeholder="Enter Year" class="w-full border p-3 rounded">

                <button type="submit" class="bg-slate-900 text-white px-5 py-3 rounded">
                    Register
                </button>

            </form>
        `;

        document.getElementById("register-form").addEventListener("submit", function (event) {

            event.preventDefault();

            const student = {
                name: document.getElementById("student-name").value,
                course: document.getElementById("student-course").value,
                year: document.getElementById("student-year").value
            };

            fetch("/students", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(student)
            })
            .then(response => response.json())
            .then(data => {

                mainDiv.innerHTML += `
                    <p class="mt-4 text-green-600">
                        ${data.message}
                    </p>
                `;
            });
        });

        return;
    }

    fetch(route, {
        headers: {
            "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {

        if (route === "/about") {
            mainDiv.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">
                    ${data.name}
                </h2>

                <p>Established: ${data.established}</p>
                <p>Location: ${data.location}</p>
            `;
        }

        else if (route === "/courses") {
            mainDiv.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">
                    Courses
                </h2>

                <ul class="space-y-3">
                    ${data.map(course => `
                        <li>
                            <a href="/courses?name=${course.name}"
                               class="text-blue-600 hover:underline">
                                ${course.name}
                            </a>

                            - ${course.duration}

                            <br>

                            ${course.description}
                        </li>
                    `).join("")}
                </ul>
            `;
        }

        else if (route.startsWith("/courses?name=")) {
            mainDiv.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">
                    ${data.name}
                </h2>

                <p>
                    Duration: ${data.duration}
                </p>

                <p>
                    ${data.description}
                </p>
            `;
        }

        else if (route === "/students") {
            mainDiv.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">
                    Students
                </h2>

                <p>Total Students: ${data.length}</p>

                <ul class="mt-4 space-y-2">
                    ${data.map(student => `
                        <li>
                            ${student.name} -
                            ${student.course} -
                            ${student.year}
                        </li>
                    `).join("")}
                </ul>
            `;
        }

        else if (route === "/facilities") {
            mainDiv.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">
                    Facilities
                </h2>

                <ul class="space-y-2">
                    ${data.map(item => `
                        <li>${item}</li>
                    `).join("")}
                </ul>
            `;
        }

        else if (route === "/placement") {
            mainDiv.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">
                    Placement
                </h2>

                <p>${data.message}</p>

                <h3 class="text-xl font-bold mt-4">
                    Recruiting Companies
                </h3>

                <ul class="space-y-2 mt-2">
                    ${data.companies.map(company => `
                        <li>${company}</li>
                    `).join("")}
                </ul>
            `;
        }

        else if (route === "/contact") {
            mainDiv.innerHTML = `
                <h2 class="text-3xl font-bold mb-4">
                    Contact
                </h2>

                <p>Phone: ${data.phone}</p>
                <p>Email: ${data.email}</p>
                <p>Location: ${data.location}</p>
            `;
        }
    });
});
