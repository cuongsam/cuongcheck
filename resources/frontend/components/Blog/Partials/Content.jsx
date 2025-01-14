import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import RegisterForm from "./RegisterForm";
import { getData } from "../../../utils/api";
import { useDispatch, useSelector } from 'react-redux';
import useFetch from "../../../hooks/useFetch";
import Pusher from "pusher-js";
import toastr from "toastr";

export default function Content() {
  const { language, category, level } = useParams();
  const [showModal, setShowModal] = useState(false)
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);


  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    const params = {
      language: language,
      category: category,
      level: level,
      user_id: localStorage.getItem('user_id')
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    
    (async () => {
      const res = await getData(`get-lessons?${queryString}`)
      setPosts(res.data)
    })()
  }, [language, category, level])

  const categories = useFetch('get-categories')
  const levels = useFetch('get-levels')


  useEffect(() => {
    Pusher.logToConsole = true;
    var pusher = new Pusher('bbad5a8e394db843afe9', {
      cluster: 'ap1'
    });
    const channel = pusher.subscribe("my-channel");
    channel.bind("my-confirmed", (data) => {
        if (data?.type === 3) {
            toastr.error(
                `Post rejected: ${data.title}`,
                "Rejection Notice",
                {
                    closeButton: true,
                    progressBar: true,
                    positionClass: "toast-top-right",
                    timeOut: 5000,
                    onclick: () => {
                        console.log("Rejection clicked!");
                    },
                }
            );
        } else if (data?.type === 2) {
            toastr.success(
                `Post approved: ${data.title}`,
                "Approval Notice",
                {
                    closeButton: true,
                    progressBar: true,
                    positionClass: "toast-top-right",
                    timeOut: 5000,
                    onclick: () => {
                        window.location.href = `/posts/${data.id}`;
                    },
                }
            );
        }
    });

    return () => {
        channel.unbind("my-confirmed");
        pusher.unsubscribe("my-channel");
    };
}, []);


useEffect(() => {
  setFilteredPosts(posts);
}, [posts]);

const handleSearch = (e) => {
  e.preventDefault();
  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
);
setFilteredPosts(filtered);
};


  return (
    <>
      <div className="blog-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center cursor-scale">
                <div className="section-sub-title">
                  <h5>POST NEWS</h5>
                </div>
                <div className="section-main-title cursor-scale">
                  <h1>Caligraphy</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <div className="widget-sidber">
                    <div className="widget_search">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            name="s"
                            value={searchTerm}
                            placeholder="Search Here"
                            title="Search for:"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="icons">
                            <i className="fa fa-search" />
                        </button>
                    </form>
                    </div>
                  </div>
                  <div className="widget-sidber">
                    <div className="widget-sidber-content">
                      <h4>Category</h4>
                    </div>
                    <div className="widget-category">
                      <ul>
                        {
                          categories && categories.map(cat => {
                            return (
                              <li key={cat.id} className={ cat.id == category ? 'active' : '' }>
                                <Link to={`/blog/${language}/${cat.id}`}>
                                  {cat.name}
                                </Link>

                                <ul className="submenu">
                                  {
                                    levels && levels.map(lvl => {
                                      return (
                                        <li key={lvl.id} className={ cat.id == category && lvl.id == level ? 'active' : 'not-active' }>
                                          <Link to={`/blog/${language}/${cat.id}/${lvl.id}`}>
                                            {lvl.name}
                                          </Link>
                                        </li>
                                      )
                                    })
                                  }
                                </ul>
                              </li>
                            )
                          })
                        }

                      </ul>
                    </div>
                  </div>
                
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="row">
                
                
                 {filteredPosts && filteredPosts.map((post, index) => (
                   <div className="col-lg-6 col-md-6" key={index}>
                   <div className="blog-singele-box">
                       <div className="blog-thumb">
                              {
                                post.isLearnedLesson && (
                                  <div className="learnedTag learned">
                                    <span>Learned</span>
                                  </div>
                                )
                              }
                              {
                                !post.isLearnedLesson && (
                                  <div className="learnedTag notlearnedyet">
                                    <span>Not Learned Yet</span>
                                  </div>
                                )
                              }
                            <img src={ post.thumbnail } alt="blog" height={400} style={{'objectFit': 'cover'}} />
                            <div className="blog-content">
                              <h3 className="blog-title">
                                <Link to={`/lesson/${post.slug}`}>{ post.title }</Link>
                              </h3>
                              <p className="blog-desc">
                                { post.short_description }
                              </p>
                              <div className="blog-btn">
                                <Link to={`/lesson/${post.slug}`}>CLICK HERE</Link>
                              </div>
                            </div>
                          </div>
                          <div className="blog-meta-title">
                            <h2>
                              <Link to={`/lesson/${post.slug}`}>{ post.title }</Link>
                            </h2>
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>

            </div>

          </div>
        </div>
      </div>

      <div className="call-to-action-area">
        <div className="container">
          <div className="row call-bg align-items-center">
            <div className="col-lg-9 col-md-8">
              <div className="call-action-content">
                <h5 className="call-action-title">FORM FILL-UP</h5>
                <h1 className="call-sub-title">Login to practice</h1>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="call-action-btn">
                <a href="#" onClick={openModal}>Getting started!</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        showModal && (
          <div className="myModal">
            <div className="initModal">

            <RegisterForm closeModal={closeModal} />

            </div>
          </div>
        )
      }

    </>
  )
}