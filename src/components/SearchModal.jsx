import React, { useState } from "react";
import "./SearchModal.css";

function SearchModal({ value, activeSearchTab, setActiveSearchTab}) {
    const [isClosing, setIsClosing] = useState(false);
    
    // ну тут короче нет логики какой-то вот
    const users = [
        { id: 1, name: `@hello`, type: "Hello" },
        { id: 2, name: `@hello_2`, type: "hello_2" },
        { id: 3, name: `@helloWorld`, type: "God" },
        { id: 4, name: `@hello22`, type: "Александр" },
        { id: 5, name: `@helloYou`, type: "H E L L O" },
    ];
    
    const posts = [
        { id: 1, title: `hello everyone! My name is ...`, type: "@rebirth" },
        { id: 2, title: `hello world!`, type: "@randomtype93" }
    ];
    const shouldShowResults = value.toLowerCase() === 'hello';

    return (
        <div className={`search-modal ${isClosing ? "closing" : ""}`}>
            
            <div className="tabs">
                <button 
                    className={`tab ${activeSearchTab === "users" ? "active" : ""}`}
                    onClick={() => setActiveSearchTab("users")}
                >
                    Users
                </button>
                <button 
                    className={`tab ${activeSearchTab === "posts" ? "active" : ""}`}
                    onClick={() => setActiveSearchTab("posts")}
                >
                    Posts
                </button>
            </div>

            <div className="tab-content-wrapper">
                {shouldShowResults ? (
                    <>
                        <div 
                            className={`tab-content ${activeSearchTab === "users" ? "active" : ""}`}
                            style={{ transform: `translateX(${activeSearchTab === "users" ? 0 : -100}%)` }}
                        >
                            {users.map(item => (
                                <div className="search-item" key={item.id}>
                                    <span className="search-result">{item.name}</span>
                                    <span className="search-meta">{item.type}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div 
                            className={`tab-content ${activeSearchTab === "posts" ? "active" : ""}`}
                            style={{ transform: `translateX(${activeSearchTab === "posts" ? 0 : 100}%)` }}
                        >
                            {posts.map(item => (
                                <div className="search-item" key={item.id}>
                                    <span className="search-result">{item.title}</span>
                                    <span className="search-meta">{item.type}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-results">
                        <p>No results found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchModal;