import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, MapPin, Send, Sparkles, UserPlus, Users, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  createDefaultMatchComposer,
  createPublishedMatchRequest,
  getMatchRestaurantOptions,
  getMatchStatusMeta,
  MATCH_BUDGET_OPTIONS,
  MATCH_PARTY_SIZE_OPTIONS,
  MATCH_PREFERENCE_OPTIONS,
  MATCH_REQUESTS_DEMO,
  MATCH_TIME_OPTIONS,
} from "../lib/demo/matchingData";

const SOURCE_COPY = {
  ai: {
    title: "从 AI 助手切换到搭一搭",
    description: "先把这顿饭的条件配出来，再看能直接加入谁的局。",
  },
  map: {
    title: "先配置偏好，再看附近的局",
    description: "适合临时想找人吃饭，先选时间和预算。",
  },
  restaurant: {
    title: "已锁定目标店铺",
    description: "你可以直接围绕这家店发需求或加入现成的局。",
  },
};

function getInitialRequests() {
  return MATCH_REQUESTS_DEMO.map(function (request) {
    return JSON.parse(JSON.stringify(request));
  });
}

function buildRequester(user) {
  return {
    id: user && user.id ? user.id : "local-demo-me",
    name: user && user.nickname ? user.nickname : "你",
    school: user && user.school ? user.school : "湖南大学",
    avatarUrl: user && user.avatarUrl ? user.avatarUrl : "",
    avatarTone: "bg-brand-primarySoft text-brand-primary",
  };
}

function getAvatarLabel(name) {
  if (!name) return "搭";
  return name.slice(0, 1);
}

function updateStatusByCount(request, nextCount) {
  if (nextCount >= request.partySize) {
    return "soon";
  }
  if (nextCount >= request.partySize - 1) {
    return "almost";
  }
  return request.status;
}

const MatchingSystem = ({ isOpen, onClose, matchingContext, restaurants = [] }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(getInitialRequests);
  const [composer, setComposer] = useState(createDefaultMatchComposer(null));
  const [feedback, setFeedback] = useState(null);

  const source = matchingContext && matchingContext.source ? matchingContext.source : "map";
  const targetRestaurant = matchingContext && matchingContext.targetRestaurant ? matchingContext.targetRestaurant : null;
  const sourceCopy = SOURCE_COPY[source] || SOURCE_COPY.map;

  const restaurantOptions = useMemo(function () {
    return getMatchRestaurantOptions(restaurants);
  }, [restaurants]);

  useEffect(function () {
    if (!isOpen) return;
    setComposer(createDefaultMatchComposer(targetRestaurant));
    setRequests(getInitialRequests());
    setFeedback(null);
  }, [isOpen, targetRestaurant]);

  const filteredRequests = useMemo(function () {
    return requests.filter(function (request) {
      if (composer.restaurantName && request.restaurant.name !== composer.restaurantName) {
        return false;
      }
      if (request.timeSlot !== composer.timeSlot) {
        return false;
      }
      if (request.budgetRange !== composer.budgetRange) {
        return false;
      }
      if (composer.preference !== "都可以" && !request.preferenceTags.includes(composer.preference)) {
        return false;
      }
      if (!composer.acceptSplitTable && request.preferenceTags.includes("接受拼桌")) {
        return false;
      }
      return request.currentCount < request.partySize;
    });
  }, [composer, requests]);

  if (!isOpen) return null;

  const requester = buildRequester(user);

  const handleComposerChange = function (key, value) {
    setComposer(function (current) {
      return {
        ...current,
        [key]: value,
      };
    });
  };

  const handleRestaurantChange = function (event) {
    const nextId = event.target.value;
    const nextOption = restaurantOptions.find(function (option) {
      return option.id === nextId;
    });
    setComposer(function (current) {
      return {
        ...current,
        restaurantId: nextId,
        restaurantName: nextOption ? nextOption.name : "",
      };
    });
  };

  const handleMatch = function () {
    if (filteredRequests.length === 0) {
      setFeedback({
        type: "empty",
        count: 0,
        highlightId: null,
        message: "暂时没有完全符合的局，你可以直接发布自己的需求。",
      });
      return;
    }

    setFeedback({
      type: "matched",
      count: filteredRequests.length,
      highlightId: filteredRequests[0].id,
      message: "已为你找到 " + filteredRequests.length + " 个可加入需求。",
    });
  };

  const handlePublish = function () {
    const nextRequest = createPublishedMatchRequest({
      composer: composer,
      user: user,
      restaurantOptions: restaurantOptions,
      targetRestaurant: targetRestaurant,
    });
    setRequests(function (current) {
      return [nextRequest].concat(current);
    });
    setFeedback({
      type: "published",
      count: 1,
      highlightId: nextRequest.id,
      message: "你的搭子需求已发布，现在其他人可以直接加入。",
    });
  };

  const handleJoin = function (requestId) {
    setRequests(function (current) {
      return current.map(function (request) {
        if (request.id !== requestId) {
          return request;
        }
        const hasRequester = request.participants.some(function (participant) {
          return participant.id === requester.id;
        });
        const nextCount = Math.min(request.partySize, request.currentCount + (hasRequester ? 0 : 1));
        return {
          ...request,
          currentCount: nextCount,
          status: updateStatusByCount(request, nextCount),
          participants: hasRequester ? request.participants : request.participants.concat(requester),
        };
      });
    });
    setFeedback({
      type: "joined",
      count: 1,
      highlightId: requestId,
      message: "你已加入这个局，记得准时赴约。",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-brand-paperDeep bg-brand-paperSoft shadow-2xl">
        <div className="flex items-start justify-between border-b border-brand-paperDeep px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">搭一搭</h2>
                <span className="rounded-full bg-brand-paper px-2 py-0.5 text-xs text-gray-500">演示功能</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-700">{sourceCopy.title}</p>
              <p className="mt-1 text-xs text-gray-500">{targetRestaurant ? "已锁定店铺：" + targetRestaurant.name + " · " + sourceCopy.description : sourceCopy.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭搭一搭"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-brand-paper hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[360px,minmax(0,1fr)]">
          <div className="border-b border-brand-paperDeep bg-brand-paper/70 p-5 lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <div className="rounded-3xl border border-brand-paperDeep bg-brand-paperSoft p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                先配置你的搭子需求
              </div>
              <p className="mt-1 text-xs leading-5 text-gray-500">直接发布，或先一键匹配现成的局。</p>

              <div className="mt-4 space-y-3">
                <label className="block text-xs font-medium text-gray-500">
                  店铺
                  <select
                    value={composer.restaurantId}
                    onChange={handleRestaurantChange}
                    className="mt-1 w-full rounded-2xl border border-brand-paperDeep bg-brand-paper px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="">周边热门店铺</option>
                    {restaurantOptions.map(function (option) {
                      return (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <label className="block text-xs font-medium text-gray-500">
                    时间段
                    <select
                      value={composer.timeSlot}
                      onChange={function (event) { handleComposerChange("timeSlot", event.target.value); }}
                      className="mt-1 w-full rounded-2xl border border-brand-paperDeep bg-brand-paper px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    >
                      {MATCH_TIME_OPTIONS.map(function (option) {
                        return <option key={option} value={option}>{option}</option>;
                      })}
                    </select>
                  </label>

                  <label className="block text-xs font-medium text-gray-500">
                    目标人数
                    <select
                      value={String(composer.partySize)}
                      onChange={function (event) { handleComposerChange("partySize", Number(event.target.value)); }}
                      className="mt-1 w-full rounded-2xl border border-brand-paperDeep bg-brand-paper px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    >
                      {MATCH_PARTY_SIZE_OPTIONS.map(function (option) {
                        return <option key={option} value={option}>{option} 人</option>;
                      })}
                    </select>
                  </label>
                </div>

                <label className="block text-xs font-medium text-gray-500">
                  人均预算
                  <select
                    value={composer.budgetRange}
                    onChange={function (event) { handleComposerChange("budgetRange", event.target.value); }}
                    className="mt-1 w-full rounded-2xl border border-brand-paperDeep bg-brand-paper px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  >
                    {MATCH_BUDGET_OPTIONS.map(function (option) {
                      return <option key={option} value={option}>{option}</option>;
                    })}
                  </select>
                </label>

                <div>
                  <div className="text-xs font-medium text-gray-500">搭子偏好</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {MATCH_PREFERENCE_OPTIONS.map(function (option) {
                      const isActive = composer.preference === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={function () { handleComposerChange("preference", option); }}
                          className={"rounded-full px-3 py-2 text-xs font-medium transition " + (isActive ? "bg-brand-primary text-white shadow-sm" : "bg-brand-paper text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primary")}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-2 rounded-2xl border border-brand-paperDeep bg-brand-paper px-3 py-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={composer.acceptSplitTable}
                    onChange={function (event) { handleComposerChange("acceptSplitTable", event.target.checked); }}
                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  接受拼桌 / 临时加人
                </label>

                <label className="block text-xs font-medium text-gray-500">
                  备注
                  <textarea
                    value={composer.note}
                    onChange={function (event) { handleComposerChange("note", event.target.value); }}
                    rows={3}
                    placeholder="例如：想找能吃辣、吃完还要去自习的人。"
                    className="mt-1 w-full resize-none rounded-2xl border border-brand-paperDeep bg-brand-paper px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                </label>
              </div>

              {feedback && (
                <div className={"mt-4 rounded-2xl border px-3 py-3 text-sm " + (feedback.type === "empty" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-brand-primarySoft bg-brand-primarySubtle text-brand-primary")}>
                  {feedback.message}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <button
                  type="button"
                  onClick={handleMatch}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primaryHover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <Sparkles className="h-4 w-4" />
                  一键匹配
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-brand-primarySoft bg-brand-paper px-4 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-primarySubtle focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <Send className="h-4 w-4" />
                  发布需求
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 bg-brand-paperSoft p-5 lg:overflow-y-auto">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">待搭列表</h3>
                <p className="mt-1 text-sm text-gray-500">像待拼团一样看附近正在等人的局，先加入再开吃。</p>
              </div>
              <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-medium text-gray-500">
                {requests.length} 个局
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {requests.map(function (request) {
                const statusMeta = getMatchStatusMeta(request.status);
                const isHighlighted = feedback && feedback.highlightId === request.id;
                const isFull = request.currentCount >= request.partySize;
                return (
                  <article
                    key={request.id}
                    className={"rounded-3xl border bg-brand-paper px-4 py-4 shadow-sm transition " + (isHighlighted ? "border-brand-primary shadow-md ring-2 ring-brand-primary/20" : statusMeta.cardClass)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={"flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold " + request.initiator.avatarTone}>
                          {request.initiator.avatarUrl ? (
                            <img src={request.initiator.avatarUrl} alt={request.initiator.name} className="h-full w-full rounded-2xl object-cover" />
                          ) : (
                            getAvatarLabel(request.initiator.name)
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{request.initiator.name}</span>
                            <span className="rounded-full bg-brand-paperSoft px-2 py-0.5 text-[11px] text-gray-500">{request.initiator.school}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {request.restaurant.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {request.timeSlot}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={"rounded-full px-2.5 py-1 text-[11px] font-medium " + statusMeta.badgeClass}>
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-primarySubtle px-2.5 py-1 text-xs font-medium text-brand-primary">
                        {request.currentCount}/{request.partySize} 人
                      </span>
                      <span className="rounded-full bg-brand-paperSoft px-2.5 py-1 text-xs text-gray-500">
                        人均 {request.budgetRange}
                      </span>
                      {request.preferenceTags.map(function (tag) {
                        return (
                          <span key={tag} className="rounded-full bg-brand-paperSoft px-2.5 py-1 text-xs text-gray-500">
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">{request.note}</p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {request.participants.length} 位同学已在局中
                      </div>
                      <button
                        type="button"
                        onClick={function () { handleJoin(request.id); }}
                        disabled={isFull}
                        className={"inline-flex items-center gap-1 rounded-2xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary " + (isFull ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-brand-primary text-white hover:bg-brand-primaryHover")}
                      >
                        {isFull ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                        {isFull ? "已满员" : "加入这个局"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {feedback && feedback.type === "empty" && (
              <div className="mt-4 rounded-3xl border border-dashed border-brand-paperDeep bg-brand-paper px-4 py-5 text-sm text-gray-500">
                当前筛选条件下没有完全命中的局。你可以先发布自己的需求，再等附近同学响应。
              </div>
            )}

            <div className="mt-6 rounded-3xl border border-brand-paperDeep bg-brand-paper px-4 py-4 text-sm text-gray-500">
              <div className="flex items-center gap-2 text-gray-700">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                原型说明
              </div>
              <p className="mt-2 leading-6">
                待搭列表和发布结果均为前端演示状态，本轮只验证交互结构、信息密度和页面切换，不接真实匹配服务。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingSystem;
