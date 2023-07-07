import { createContext, useState } from "react";
import { faker } from "@faker-js/faker";
import { useContext } from "react";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const DUMMY_POSTS = [
  {
    title: "Wireless Hard Drive",
    body: "If we parse the microchip, we can get to the SMS solid state HTTP panel!",
    id: 1,
  },
  {
    title: "Bluetooth Protocol",
    body: "Use the solid state IP bus, then you can quantify the 1080p transmitter!",
    id: 2,
  },
];

// 1) CREATE A NEW CONTEXT
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  const archivedPosts = posts.filter((post) => post.archived);

  function handleTogglePost(id) {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === id ? { ...post, archived: !post.archived } : post
      )
    );
  }

  function handleDeletePost(id) {
    setPosts((posts) => posts.filter((post) => post.id !== id));
  }

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        archivedPosts,
        onMoveToArchive: handleTogglePost,
        onClearPosts: handleClearPosts,
        onAddPost: handleAddPost,
        onDeletePost: handleDeletePost,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of PostProvider");

  return context;
}

export { PostProvider, usePosts };
