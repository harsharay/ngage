import { BrowserRouter, Route, Switch } from "react-router-dom"
import Main from "./Components/Main/Main"
import Post from "./Components/Post/Post"
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" component={Main} exact/>
          <Route path="/posts/:postId" component={Post}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
