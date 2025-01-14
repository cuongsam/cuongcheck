import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import useFetch from "../../../hooks/useFetch";
import { getData } from "../../../utils/api";
import { useDispatch, useSelector } from 'react-redux';
import PracticeArea from "./PracticeArea";


export default function ContentLesson() {
  const { slug } = useParams()
  const [lesson, setLesson] = useState('')
  const [isShowPracticeArea, setIsShowPracticeArea] = useState(false)
  const { token } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false)
  

  useEffect(() => {
    (async () => {
      const res = await getData(`get-lesson/${slug}`)
      setLesson(res)
    })()
  }, [slug])

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }


  

  return (
    <>
      <div className="blog-details-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center cursor-scale">
                <div className="section-sub-title">
                  <h5>POST NEWS</h5>
                </div>
                <div className="section-main-title cursor-scale">
                  <h1>{ lesson?.title }</h1>
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
                      <form action="#" method="get">
                        <input
                          type="text"
                          name="s"
                          defaultValue=""
                          placeholder="Search Here"
                          title="Search for:"
                        />
                        <button type="submit" className="icons">
                          <i className="fa fa-search" />
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  <div className="widget-sidber">
                    <div className="widget-sidber-content">
                      <h4>Latest Posts</h4>
                    </div>
                    <div className="sidber-widget-recent-post">
                      <div className="recent-widget-thumb">
                        <img src="theme/images/inner/recent-post.png" alt="" />
                      </div>
                      <div className="recent-widget-content">
                        <a href="blog-details.html">
                          Top crypto exchange influencers
                        </a>
                        <p> feb, 26 2024</p>
                      </div>
                    </div>
                    <div className="sidber-widget-recent-post">
                      <div className="recent-widget-thumb">
                        <img src="theme/images/inner/recent-post2.png" alt="" />
                      </div>
                      <div className="recent-widget-content">
                        <a href="blog-details.html">
                          Necessity may give us best virtual court
                        </a>
                        <p> June, 15 2024</p>
                      </div>
                    </div>
                    <div className="sidber-widget-recent-post">
                      <div className="recent-widget-thumb">
                        <img src="theme/images/inner/recent-post3.png" alt="" />
                      </div>
                      <div className="recent-widget-content">
                        <a href="blog-details.html">
                          You should know about business plan
                        </a>
                        <p> april, 10 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="widget-sidber">
                    <div className="widget-sidber-content">
                      <h4>Tags</h4>
                    </div>
                    <div className="widget-catefories-tags">
                      <a href="#">Consulting</a>
                      <a href="#">Agency</a>
                      <a href="#">Business</a>
                      <a href="#">Digital</a>
                      <a href="#">Experience</a>
                      <a href="#">Technology</a>
                    </div>
                  </div>
                  <div className="sidebar__single sidebar__comments">
                    <h3 className="sidebar__title">Recent Comments</h3>
                    <ul className="sidebar__comments-list list-unstyled">
                      <li>
                        <div className="sidebar__comments-icon">
                          {" "}
                          <i className="fas fa-comments" />
                        </div>
                        <div className="sidebar__comments-text-box">
                          <p>
                            A wordpress commenter on <br />
                            launch new mobile app{" "}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="sidebar__comments-icon">
                          {" "}
                          <i className="fas fa-comments" />{" "}
                        </div>
                        <div className="sidebar__comments-text-box">
                          <p>
                            {" "}
                            <span>John Doe</span> on template:
                          </p>
                          <h5>comments</h5>
                        </div>
                      </li>
                      <li>
                        <div className="sidebar__comments-icon">
                          {" "}
                          <i className="fas fa-comments" />{" "}
                        </div>
                        <div className="sidebar__comments-text-box">
                          <p>
                            A wordpress commenter on <br />
                            launch new mobile app{" "}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="sidebar__comments-icon">
                          {" "}
                          <i className="fas fa-comments" />{" "}
                        </div>
                        <div className="sidebar__comments-text-box">
                          <p>
                            {" "}
                            <span>John Doe</span> on template:
                          </p>
                          <h5>comments</h5>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-12">
                  <div className="blog-details-thumb">
                  <img src={ lesson?.thumbnail } alt="thumb" />
                  </div>
                  <div className="blog-details-content">
                    <div className="meta-blog">
                      <span className="mate-text">
                        <i className="fa-solid fa-user" />
                        By admin
                      </span>
                      <span className="mate-comment">
                        <i className="fa-solid fa-comments" />
                        02 Comments
                      </span>
                    </div>
                    <h4 className="blog-details-title">{ lesson?.title }</h4>

                    <div dangerouslySetInnerHTML={{ __html: lesson?.content }} />
                  </div>
                  <div className="blog-details-socila-box">
                    <div className="row align-items-center">
                      <div className="col-lg-6 col-md-6">
                        <div className="blog-details-category">

                          {
                            token && (
                              <span>
                                <a className="active-class" style={{'cursor': 'pointer'}} onClick={openModal}>
                                  Let practice now!
                                </a>
                              </span>
                            )
                          }

                          {
                            !token && (
                              <span>
                                <Link className="active-class" to={'/user/login'}>Login to practice!</Link>
                              </span>
                            )
                          }

                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="blog-details-social-icon">
                          <ul>
                            <li>
                              <a href="#">
                                <i className="fab fa-facebook-f" />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fa-brands fa-x-twitter" />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fab fa-linkedin-in" />
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="fab fa-pinterest-p" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {
                    showModal && (
                      <div className="myModal">
                        <div className="initModal">

                        <PracticeArea closeModal={closeModal} lesson={lesson} />

                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

    </>
  )
}