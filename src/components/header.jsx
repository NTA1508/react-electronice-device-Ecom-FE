import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const [isMdAccountVisible, setIsMdAccountVisible] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const accountButtonRef = useRef(null);
  const mdAccountRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);

  const [user, setUser] = useState(null);
  let [isAdmin, setAdmin] = useState(false);
  let [cartNum, setCartNum] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      axios
        .get(`http://localhost:8081/api/v1/user/${decodedToken.id}`)
        .then((result) => {
          setAdmin(result.data.role === "ADMIN"); // Set isAdmin boolean value
          setUser(result.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      axios
        .get(`http://localhost:8081/api/v1/cart/getCart/${token}`)
        .then((result) => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          cartNum = 0
          for (let index = 0; index < result.data.length; index++) {
            cartNum ++
          }
          setCartNum(cartNum)
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        accountButtonRef.current &&
        mdAccountRef.current &&
        !accountButtonRef.current.contains(event.target) &&
        !mdAccountRef.current.contains(event.target)
      ) {
        setIsMdAccountVisible(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/v1/product/getAll")
      .then((response) => setProducts(response.data))
      .catch((err) => console.log(err));
  }, []);

  const handleAccountButtonClick = (event) => {
    event.stopPropagation();
    setIsMdAccountVisible((prev) => !prev);
  };

  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setSearchResults(filteredProducts);
  }, [searchQuery, products]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <>
      <header>
        <div className="hunter">
          <p>
            <span>
            すべての水着がサマーセールで50％オフ＆送料無料のエクスプレス配送！
            </span>
            <Link to="/home">今すぐ購入する</Link>
          </p>
        </div>
        <div className="container">
          <div className="navbar">
            <Link to="/home" className="logo">
              <span>電気</span>物
            </Link>
            <div className="sidebar">
              <NavLink
                to="/home"
                className={`sidebar-item ${
                  activeNavItem === "home" ? "active" : ""
                }`}
                onClick={() => handleNavItemClick("home")}
              >
                ホーム
              </NavLink>
              <NavLink
                to="/contact"
                className={`sidebar-item ${
                  activeNavItem === "contact" ? "active" : ""
                }`}
                onClick={() => handleNavItemClick("contact")}
              >
                お問い合わせ
              </NavLink>
              <NavLink
                to="/about"
                className={`sidebar-item ${
                  activeNavItem === "about" ? "active" : ""
                }`}
                onClick={() => handleNavItemClick("about")}
              >
                概要
              </NavLink>
              <NavLink
                to="/login"
                className={`sidebar-item ${
                  activeNavItem === "login" ? "active" : ""
                }`}
                onClick={() => handleNavItemClick("login")}
                style={{ display: user ? "none" : "" }}
              >
                ログイン
              </NavLink>
              <NavLink
                to="/admin"
                className={`sidebar-item ${
                  activeNavItem === "admin" ? "active" : ""
                }`}
                onClick={() => handleNavItemClick("admin")}
                style={{ display: isAdmin ? "" : "none" }}
              >
                管理者
              </NavLink>
            </div>
            <div className="tools-list">
              <div className="search-nav">
                <input
                  className="search-input"
                  type="text"
                  placeholder="検索..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <i className="bx bx-search icon-search" />
                {searchQuery && (
                  <div className="search-result">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="search-title">
                        検索結果: &nbsp;
                          <span>{searchResults.length}</span>&nbsp;結果
                        </div>
                        <div className="search-list">
                          {searchResults.map((result) => (
                            <Link to={`/detail/${result.id}`} key={result.id}>
                              <div className="search-item">
                                <i className="bx bx-search icon-search"></i>
                                <span>{result.productName}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="search-title">
                        検索結果: &nbsp;<span>0</span>&nbsp;結果
                        </div>
                        <div className="search-list">
                          <div className="search-item">
                            <i className="bx bx-search icon-search"></i>
                            <span>{searchQuery}がありません </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Link to="/wishlist">
                <div
                  className="tools-item"
                  style={{ display: user ? "" : "none" }}
                >
                  <i className="bx bx-heart" />
                  <span className="number-icon" id="heart-number">
                    0
                  </span>
                </div>
              </Link>
              <Link to="/cart" style={{ display: user ? "" : "none" }}>
                <div className="tools-item">
                  <i className="bx bx-cart-alt" />
                  <span className="number-icon" id="cart-number">
                    {cartNum}
                  </span>
                </div>
              </Link>
              <div
                className="tools-item account"
                id="account"
                onClick={handleAccountButtonClick}
                ref={accountButtonRef}
                style={{ display: user ? "" : "none" }}
              >
                <i className="bx bx-user" />
                <div
                  className="md-account"
                  id="md-account"
                  style={{ display: isMdAccountVisible ? "block" : "none" }}
                  ref={mdAccountRef}
                >
                  <Link to={`/profile/${user ? user.id : ""}`}>
                    <i className="bx bx-user" />
                    <span>アカウントを管理</span>
                  </Link>
                  <Link to={"/order"}>
                    <i className="bx bxs-shopping-bags" />
                    <span>私の注文</span>
                  </Link>
                  <Link onClick={handleLogOut}>
                    <i className="bx bx-log-out" />
                    <span>ログアウト</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
