
//   <% books.forEach(book => { %>
//     <form action="/details/<%= book.id %>" method="GET">
//         <div id=<%=book.id %> >
//             <img src=<%=book.image_url %> />
//             <h3>
//                 <%= book.title %>
//             </h3>
//             <h4>
//                 <%= book.author %>
//             </h4>
//             <p class="isbn">
//                 <%= book.isbn %>
//             </p>
//             <input type="submit" class="blackButton" value="View Details">
//         </div>

//     </form>

//     <% }) %>



// <% books.forEach( (book,ind)=> { %> <form id=<%=ind %> method="post" action="/show"> <div> <img src=<%=book.img
// %> /> <input type="hidden" name="img" value="<%= book.url %>">
// <h3>
// <%= book.title %>
// </h3> <input type="hidden" name="title" value="<%= book.title %>">
// <h4>
// <%= book.author %>
// </h4> <input type="hidden" name="author" value="<%= book.author %>">
// <p>
// <%= book.isbn %>
// </p> <input type="hidden" name="isbn" value="<%= book.isbn %>"> <input type="hidden"
// name="description" value="<%= book.description %>">
// </div>
// </form>
// <% }) %>