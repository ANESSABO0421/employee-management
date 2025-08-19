async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/get");
    const data = await response.json();
    console.log(data);
    let str = "";
    {
      data.map((d) => {
        str += `
        <div class="bg-white p-4 gap-5 rounded-lg shadow-md text-black max-w-xs flex flex-col ">
            <img src='${d.image}' class="rounded"/>
            <p class="mb-2">Name:-${d.name}</p>
            <p class="mb-2">Email:-${d.email}</p>
            <p>Password:-${d.password}</p>
            <div class="flex gap-4">
                <button class="bg-yellow-500 h-[50px] w-[100px] rounded" onclick="editBtn('${d._id}')">Edit<button>
                <button  class="bg-red-500 h-[50px] w-[100px] rounded" onclick="deleteBtn('${d._id}')">Delete<button>
            </div>
            </div>
            `;
      });
      document.getElementById("main").innerHTML = str;
    }
  } catch (error) {}
}

fetchData();

function editBtn(id) {
  window.location.href = `/edit?id=${id}`;
}

async function deleteBtn(id) {
  try {
    const deleteCard = await fetch("http://localhost:3000/delete", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });
    if (deleteCard) {
      window.location.reload();
      alert("data is deleted");
    } else {
      alert("data is not deleted");
    }
  } catch (error) {
    console.log(error);
  }
}
