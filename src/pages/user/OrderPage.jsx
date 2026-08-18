import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { createOrder, getToken } from "../../api/backend";
import { useCart } from "../../context/CartContext.jsx";

export const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderState = location.state;
  const { reloadCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    recipientName: "",
    recipientPhone: "",
    address: "",
    addressDetail: "",
    memo: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!orderState || !orderState.items || orderState.items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">주문/결제</h1>
          <Card className="rounded-3xl shadow-lg">
            <CardContent className="py-10 text-center">
              <p className="text-gray-600 mb-6">
                주문할 상품 정보가 없습니다. 장바구니에서 다시 시도해주세요.
              </p>
              <Button
                className="rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500"
                onClick={() => navigate("/cart")}
              >
                장바구니로 돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { items, totalPrice, shippingFee, finalAmount } = orderState;

  const handlePayment = async () => {
    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!form.recipientName || !form.recipientPhone || !form.address) {
      alert("수령인 이름, 연락처, 주소는 필수입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder(
        {
          recipientName: form.recipientName,
          recipientPhone: form.recipientPhone,
          address: form.address,
          addressDetail: form.addressDetail,
          memo: form.memo,
        },
        token
      );
      await reloadCart();
      alert("주문이 완료되었습니다!");
      navigate("/mypage");
    } catch (error) {
      console.error("주문 실패:", error);
      alert(`주문에 실패했습니다: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">주문/결제</h1>
          <Button
            variant="outline"
            className="rounded-2xl border-teal-200"
            onClick={() => navigate("/cart")}
          >
            ← 장바구니로 돌아가기
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.4fr] gap-6">
          <div className="space-y-6">
            <Card className="rounded-3xl border-2 border-teal-50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">배송지 정보</CardTitle>
                <CardDescription>상품을 받으실 주소를 입력해주세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">수령인 이름 *</label>
                    <input
                      type="text"
                      name="recipientName"
                      value={form.recipientName}
                      onChange={handleFormChange}
                      className="w-full rounded-2xl border border-gray-200 focus:border-teal-400 focus:ring-teal-400 text-sm px-3 py-2"
                      placeholder="수령인 이름"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">연락처 *</label>
                    <input
                      type="text"
                      name="recipientPhone"
                      value={form.recipientPhone}
                      onChange={handleFormChange}
                      className="w-full rounded-2xl border border-gray-200 focus:border-teal-400 focus:ring-teal-400 text-sm px-3 py-2"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">주소 *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-gray-200 focus:border-teal-400 focus:ring-teal-400 text-sm px-3 py-2 mb-2"
                    placeholder="기본 주소"
                  />
                  <input
                    type="text"
                    name="addressDetail"
                    value={form.addressDetail}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-gray-200 focus:border-teal-400 focus:ring-teal-400 text-sm px-3 py-2"
                    placeholder="상세 주소"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">배송 메모</label>
                  <input
                    type="text"
                    name="memo"
                    value={form.memo}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-gray-200 focus:border-teal-400 focus:ring-teal-400 text-sm px-3 py-2"
                    placeholder="배송 시 요청사항"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-teal-50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">결제 수단</CardTitle>
                <CardDescription>원하시는 결제 방식을 선택하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button className="border-2 border-teal-300 rounded-2xl px-4 py-3 text-sm text-gray-800 bg-teal-50 font-medium">
                    카드 결제
                  </button>
                  <button className="border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 hover:border-teal-300 hover:bg-teal-50/40">
                    계좌 이체
                  </button>
                  <button className="border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 hover:border-teal-300 hover:bg-teal-50/40">
                    간편 결제
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-3xl border-2 border-teal-100 bg-gradient-to-br from-teal-50/60 to-emerald-50/60">
              <CardHeader>
                <CardTitle className="text-gray-800">주문 상품</CardTitle>
                <CardDescription>장바구니에서 선택한 상품만 주문됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-teal-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">수량 {item.quantity}개</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-800">
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 border-teal-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-800">결제 금액</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>상품 금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>배송비</span>
                  <span>{shippingFee === 0 ? "무료" : shippingFee.toLocaleString() + "원"}</span>
                </div>
                <div className="h-px bg-teal-200 my-1" />
                <div className="flex items-center justify-between text-lg text-gray-900">
                  <span>총 결제금액</span>
                  <span className="text-teal-600 font-semibold">{finalAmount.toLocaleString()}원</span>
                </div>
                <Button
                  className="w-full h-14 mt-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all"
                  disabled={isSubmitting}
                  onClick={handlePayment}
                >
                  {isSubmitting ? "주문 처리 중..." : `${finalAmount.toLocaleString()}원 결제하기`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
