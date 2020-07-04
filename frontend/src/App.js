import React, { useState, useEffect } from "react";
import "./App.css";
import Headerbar from "./components/Headerbar";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import { Layout } from "antd";

function App() {
    const [issueList, setIssueList] = useState([]);
    const [rectanglesList, setRectanglesList] = useState([]);
    const [reload, setReload] = useState(0);
    const [pagination, setPagination] = React.useState(0);
    const [rectangles, setRectangles] = React.useState([]);

    const incrementReload = () => {
        setReload(reload + 1);
    };

    const suivant = () => {
        if (pagination < issueList.length - 1) {
            setPagination(pagination + 1);
            emptyRectangles();
        }
    };

    const precedent = () => {
        if (pagination > 0) {
            setPagination(pagination - 1);
            emptyRectangles();
        }
    };

    const emptyRectangles = () => {
        setRectangles(() => []);
    };

    const deleteRec = (id) => {
        fetch(
            "http://127.0.0.1:8000/coord/" + id,

            {
                method: "DELETE",
                headers: new Headers({
                    Authorization:
                        "token 46654af99a9f660cf865ebc44da19dd044049348",
                }),
            }
        );
    };

    const deleteBeforeAddingNewRect = () => {
        if (issueList.length !== 0) {
            const active_issue_id = issueList[pagination].id;
            const filtered_rect = rectanglesList.filter(
                (rec) => rec.issue === active_issue_id
            );
            filtered_rect.map((rec) => {
                deleteRec(rec.id);
            });
        }
    };

    const save = () => {
        rectangles.map((rec) => {
            deleteBeforeAddingNewRect();

            const { x, y, width, height } = rec;
            let formData = new FormData();
            formData.append("x_coord", Math.round(x));
            formData.append("y_coord", Math.round(y));
            formData.append("width", Math.round(width));
            formData.append("height", Math.round(height));
            formData.append("issue", issueList[pagination].id);
            formData.append("id", rectanglesList.length + 1);
            createPost(formData);
        });
    };

    const createPost = (opts) => {
        fetch(
            "http://127.0.0.1:8000/coord/",

            {
                method: "POST",
                headers: new Headers({
                    Authorization:
                        "token 46654af99a9f660cf865ebc44da19dd044049348",
                }),
                body: opts,
            }
        )
            .then(() => fetchIssue())
            .then(() => fetchRectangles());
    };

    const fetchIssue = () => {
        fetch(
            "http://127.0.0.1:8000/issue/",

            {
                method: "GET",
                headers: new Headers({
                    Authorization:
                        "token 46654af99a9f660cf865ebc44da19dd044049348",
                }),
            }
        )
            .then((res) => res.json())
            .then((res) => setIssueList(res));
    };

    const fetchRectangles = () => {
        fetch("http://127.0.0.1:8000/coord/", {
            method: "GET",
            headers: new Headers({
                Authorization: "token 46654af99a9f660cf865ebc44da19dd044049348",
            }),
        })
            .then((res) => res.json())
            .then((res) => setRectanglesList(res));
    };

    useEffect(() => {
        fetchIssue();
        fetchRectangles();
        deleteBeforeAddingNewRect();
    }, [reload]);

    return (
        <div className="App">
            <Headerbar />
            <Layout>
                <Sidebar
                    issueList={issueList}
                    incrementReload={incrementReload}
                    pagination={pagination}
                    precedent={precedent}
                    suivant={suivant}
                    save={save}
                />
                <Canvas
                    issueList={issueList}
                    rectanglesList={rectanglesList}
                    pagination={pagination}
                    setPagination={setPagination}
                    rectangles={rectangles}
                    setRectangles={setRectangles}
                />
            </Layout>
        </div>
    );
}

export default App;
