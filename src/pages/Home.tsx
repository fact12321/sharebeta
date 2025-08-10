import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { Search, User } from 'lucide-react';
import PostCard from '../components/PostCard';
import { generatePosts } from '../data/mockData';
import { useInfiniteScrollContainer } from '../hooks/useInfiniteScroll';
import { Post } from '../types';
import './Home.css';
import { UIContext } from '../contexts/UIContext';
import SearchModal from '../components/SearchModal';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(() => generatePosts(0, 10));
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const postsRef = useRef<HTMLDivElement | null>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollTopRef = useRef(0);
  const ui = useContext(UIContext);

  const fetchMorePosts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    const nextPage = page + 1;
    const newPosts = generatePosts(nextPage, 10);
    
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setPage(nextPage);
    setLoading(false);
    
    // Simulate ending after 100 posts for demo
    if (posts.length >= 90) {
      setHasMore(false);
    }
  }, [page, loading, posts.length]);

  const { handleScroll, isFetching } = useInfiniteScrollContainer({
    fetchMore: fetchMorePosts,
    hasMore,
    loading
  });

  const onPostsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    const last = lastScrollTopRef.current;
    const delta = scrollTop - last;
    if (Math.abs(delta) > 4) {
      const isDown = delta > 0;
      setHeaderHidden(isDown && scrollTop > 12);
      lastScrollTopRef.current = scrollTop;
      ui?.setScrollState(isDown ? 'down' : 'up', scrollTop);
    }
    handleScroll(e);
  }, [handleScroll]);

  const reloadTop = useCallback(() => {
    if (postsRef.current) {
      postsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // refresh posts
    setPosts(generatePosts(0, 10));
    setPage(0);
    setHasMore(true);
  }, []);

  useEffect(() => {
    if (ui) ui.setHomeReclickHandler(reloadTop);
    return () => {
      if (ui) ui.setHomeReclickHandler(null);
    };
  }, [ui, reloadTop]);








  //методы, отвечающие за SEARCH



  //обозначение переменных (думаю тут удобнее)
  const [activeSearchTab, setActiveSearchTab] = useState("users");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  //фокус при нажатии на кнопку поиска
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);


  //тогл открытие - закрытие
  function SearchHandle() {
    if (searchOpen===true) {setShowModal(false);}
    else {setShowModal(true)}
    setSearchOpen(prev => !prev);
  }


  //реактивная смена инпута и отправка данных
  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {

    const newValue = e.target.value;
    setSearchValue(newValue);
      
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
      
    //отправка данных по истечению секунды
    timeoutRef.current = setTimeout(() => {
      if (newValue !== "") {
      const searchApi = { query: newValue, type: activeSearchTab };
      console.log(searchApi);
      }
    }, 1000);
  }

  //очистка таймера
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  //конец методов SEARCH





  
//ретюрн

  return (
    <div className="home-page">


      <header className={`home-header ${headerHidden ? 'hidden' : ''}`}>

        <h1 className="app-title" onClick={reloadTop} role="button" aria-label="Go to top and refresh">Share</h1>
        
        <input
          ref={inputRef}
          className={`search-input ${searchOpen ? "open" : ""}`}
          type="text"
          placeholder="Search..."
          onChange={(e) => {onChangeHandler(e)}}
        />

        <div className="header-actions">

          <button className="search-btn" aria-label="Search" onClick={SearchHandle}>
            <Search size={18} />
          </button> 

          <button className="profile-btn" aria-label="Profile" onClick={() => (window.location.href = '/profile')}>
            <User size={18} />
          </button>

        </div>

      </header>

      {showModal ? (<SearchModal value={searchValue} activeSearchTab={activeSearchTab} setActiveSearchTab={setActiveSearchTab}/>) : (null) }
    
        


      <div className="posts-container" ref={postsRef} onScroll={onPostsScroll}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {(loading || isFetching) && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading more posts...</p>
          </div>
        )}
        
        {!hasMore && (
          <div className="end-indicator">
            <p>You've reached the end! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
