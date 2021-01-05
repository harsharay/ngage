import { BrowserRouter, Route, Switch } from "react-router-dom"
import Main from "./Components/Main/Main"
import Post from "./Components/Post/Post"
import Nav from "./Components/Nav/Nav"
import MyPosts from "./Components/MyPosts/MyPosts"

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" component={Main} exact/>
          <Route path="/posts/:postId" component={Post} exact/>
          <Route path="/myPosts" component={MyPosts} exact/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
