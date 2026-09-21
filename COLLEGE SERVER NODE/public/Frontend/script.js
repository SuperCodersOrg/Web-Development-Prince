console.log("Script loaded");

const mainDiv = document.getElementById("main-div");
const route = window.location.pathname;

if (route === "/") {
    mainDiv.innerHTML = `
        <h1 class="text-3xl font-bold mb-4">Welcome to ABC College</h1>
        <p class="text-gray-600">Welcome to ABC College Website.</p>
    `;
}

if (route === "/about") {
    fetch("/api/about")
        .then(response => response.json())
        .then(data => {
            mainDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-4">${data.name}</h1>
                <p>Established: ${data.established}</p>
                <p>Location: ${data.location}</p>
            `;
        });
}

if (route === "/courses") {
    fetch("/api/courses")
        .then(response => response.json())
        .then(data => {
            mainDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-6">Courses</h1>

                ${data.map(course => `
                    <div class="p-4 mb-4 rounded">
                        <h2 class="text-xl font-bold">${course.name}</h2>
                        <p>${course.duration}</p>
                        <p>${course.description}</p>
                    </div>
                `).join("")}
            `;
        });
}

if (route.startsWith("/courses/")) {
    const courseName = route.split("/")[2];

    fetch(`/api/courses/${courseName}`)
        .then(response => response.json())
        .then(data => {
            mainDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-4">${data.name}</h1>
                <p>Duration: ${data.duration}</p>
                <p>${data.description}</p>
            `;
        });
}

if (route === "/students") {
    fetch("/api/students")
        .then(response => response.json())
        .then(data => {
            mainDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-6">Students</h1>

                ${data.map(student => `
                    <div class="p-4 mb-3 rounded">
                        <h2 class="font-bold">${student.name}</h2>
                        <p>Course: ${student.course}</p>
                        <p>Year: ${student.year}</p>
                    </div>
                `).join("")}
            `;
        });
}

if (route === "/facilities") {
    fetch("/api/facilities")
        .then(response => response.json())
        .then(data => {
            mainDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-6">Facilities</h1>

                ${data.map(facility => `
                    <div class="p-4 mb-3 rounded">
                        <h2 class="text-xl font-bold">${facility.name}</h2>
                        <p>${facility.description}</p>
                    </div>
                `).join("")}
            `;
        });
}

if (route === "/placement") {
    fetch("/api/placement")
        .then(response => response.json())
        .then(data => {
            mainDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-6">Placement</h1>

                <div>
                    <p>Placement Rate: ${data.placementRate}</p>
                    <p>Highest Package: ${data.highestPackage}</p>
                    <p>Average Package: ${data.averagePackage}</p>
                    <p>Companies: ${data.companies.join(", ")}</p>
                </div>
            `;
        });
}

if (route === "/contact") {
    fetch("/api/contact")
        .then(response => response.json())
        .then(data => {
            mainDiv.innerHTML = `
                <h1 class="text-3xl font-bold mb-6">Contact</h1>

                <div>
                    <p class="mb-2"><b>Phone:</b> ${data.phone}</p>
                    <p class="mb-2"><b>Email:</b> ${data.email}</p>
                    <p><b>Location:</b> ${data.location}</p>
                </div>
            `;
        });
}

if (route === "/register") {
    mainDiv.innerHTML = `
        <h1 class="text-3xl font-bold mb-6">Student Registration</h1>

        <form id="registerForm" class="max-w-md space-y-4">

            <input name="name"  type="text" placeholder="Name" class="w-full border p-3 rounded" required>

            <input name="course" type="text" placeholder="Course" class="w-full border p-3 rounded" required>

            <input name="year" type="text" placeholder="Year" class="w-full border p-3 rounded" required>


            <button type="submit" class="bg-slate-900 text-white px-5 py-3 rounded">
                Register
            </button>

        </form>
    `;

    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const name = this.elements.name.value;
        const course = this.elements.course.value;
        const year = this.elements.year.value;

        fetch("/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                course: course,
                year: year
            })
        })
        .then(response => response.json())
        .then(data => {

            if (data.student) {
                mainDiv.innerHTML = `
                    <h1 class="text-2xl font-bold mb-4">${data.message}</h1>
                    <p>Name: ${data.student.name}</p>
                    <p>Course: ${data.student.course}</p>
                    <p>Year: ${data.student.year}</p>
                `;
            } else {
                mainDiv.innerHTML = `
                    <h1 class="text-2xl font-bold">${data.message}</h1>
                `;
            }

        });
    });
}