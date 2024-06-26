import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../../useCartContext";
import axios from "axios";

export default function Cart() {
  const { cartProduct, setCartProduct } = useCartContext();
  let [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      axios
        .get(`http://localhost:8081/api/v1/cart/getCart/${token}`)
        .then((result) => {
          setCartProduct(result.data);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          totalCost = 0
          for (let index = 0; index < result.data.length; index++) {
            if(result.data[index].product.saleType === "no"){
              totalCost += result.data[index].product.price;
            }else{
              totalCost += result.data[index].product.price - result.data[index].product.price * result.data[index].product.sales / 100
            }
          }
          setTotalCost(totalCost)
          console.log(setTotalCost);
        })
        .catch((err) => console.log(err));
    }
  }, [setCartProduct]);

  const handleDelete = (id, e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:8081/api/v1/cart/delete/${id}`)
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="wishlist-nav">
          <div className="contact-title">
            <div className="contact-fix">
              <Link to="/home">ホーム</Link>
              &nbsp;/&nbsp;
              <p>カート</p>
            </div>
          </div>
          <div className="cart-wrap">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>製品名</th>
                  <th>価格</th>
                  <th>数量</th>
                  <th>行動</th>
                </tr>
              </thead>
              <tbody>
                {cartProduct && cartProduct.length > 0 ? (
                  cartProduct.map((item) => (
                    <tr key={item.id}>
                      <td className="cart-text">{item.cartId}</td>
                      <td className="cart-text">{item.product.productName}</td>
                      <td className="cart-text">{item.product.saleType !== "no" ? (item.product.price - item.product.price * item.product.sales / 100) : item.product.price}</td>
                      <td className="cart-adjust">{item.quantity}</td>
                      <td>
                      <Link to="#" onClick={(e) => handleDelete(item.cartId, e)}>
                        <button style={{ background: "none", border: "none", padding: 0 }}>
                          <i className="bi bi-trash3" />
                        </button>
                      </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="cart-text">
                    カートは空です。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="cart-synthetic">
              <h4>
              すべての商品数: <span>{cartProduct.length}</span> 商品
              </h4>
            </div>
            <div className="cart-pay">
              <div className="cart-pay__body">
                <div className="cart-poin">
                  <p>商品の合計費用: </p> <span>${totalCost}</span>
                </div>
                <div className="cart-poin">
                  <p>送料: </p> <span>${totalCost >= 140 ? 0 : totalCost * 1  / 100}</span>
                </div>
                <div className="cart-poin">
                  <p>総支払額:</p> <span>${totalCost >= 140 ? totalCost :totalCost + totalCost * 1  / 100} </span>
                </div>
              </div>
              <div className="cart-footer">
                <p>
                「注文する」を押すことは、以下に従うことに同意することを意味します。 <Link to="#">電気物の利用規約 </Link>
                </p>
                <Link to="/checkout">
                  <button className="order-cart" type="button">
                  支払いに進む
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
