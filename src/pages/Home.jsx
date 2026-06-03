import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const HERO_IMAGE = "http://localhost:8000/images/background.png";
const LOGO_URL = "http://localhost:8000/images/logo_page_acceuil.png";

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        setArticles(response.data.member || response.data);
        setFilteredArticles(response.data.member || response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (a) =>
        (a.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (a.marque || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  if (!token) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col">
        {/* HERO SECTION : Calibrée parfaitement pour 1080p */}
        <section
          className="w-full relative flex flex-col justify-between"
          style={{
            height: "100vh",
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.95) 100%), url('${HERO_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center left",
          }}
        >
          {/* Espace invisible pour pousser le bloc au milieu */}
          <div style={{ height: "15vh" }}></div>

          {/* Bloc central-droit */}
          <div className="flex-1 flex flex-col justify-center items-end px-8 md:px-16 lg:px-24">
            {/* Conteneur taille 1080p (max 500px de large) */}
            <div
              className="flex flex-col items-center w-full max-w-[500px]"
              style={{ gap: "40px" }}
            >
              <img
                src={LOGO_URL}
                alt="2ROUND Logo"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />

              {/* BOUTONS : Transparents, bordure blanche, hover ROUGE pour les deux */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  width: "100%",
                }}
              >
                <div
                  onClick={() => navigate("/login")}
                  className="w-full h-[75px] bg-transparent border-[3px] border-white text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-colors duration-300 flex justify-center items-center font-black text-xl uppercase tracking-widest cursor-pointer"
                >
                  Créer mon profil
                </div>
                <div
                  onClick={() => navigate("/sell")}
                  className="w-full h-[75px] bg-transparent border-[3px] border-white text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-colors duration-300 flex justify-center items-center font-black text-xl uppercase tracking-widest cursor-pointer"
                >
                  Commencer à vendre
                </div>
              </div>
            </div>
          </div>

          {/* MENU DU BAS : Textes agrandis (text-3xl/4xl) et mis en gras (font-bold) */}
          <div
            style={{
              width: "100%",
              paddingBottom: "40px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "900px",
                padding: "0 20px",
              }}
            >
              <div className="text-white text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#ff0000] transition-colors duration-300">
                Guide
              </div>

              <div className="text-white text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#ff0000] transition-colors duration-300">
                Catalogue
              </div>

              <div className="text-white text-3xl md:text-4xl font-bold uppercase tracking-[0.3em] cursor-pointer hover:text-[#ff0000] transition-colors duration-300">
                Revente
              </div>
            </div>
          </div>
        </section>
        {/* SECTION UN COUP DE POING ? (Intacte, identique à ton code) */}
        <section
          className="w-full min-h-screen flex flex-col justify-center py-20 relative"
          style={{
            backgroundColor: "#000000",
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)`,
          }}
        >
          <div className="w-full max-w-[1300px] mx-auto px-8 flex flex-col relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-20 text-left uppercase tracking-wide">
              UN COUP DE POING ?
            </h2>

            <div className="flex flex-row justify-between w-full">
              {/* Card 1: LES TAILLES */}
              <div
                onClick={() => navigate("/route-tailles")}
                className="w-[31%] bg-[#151515] rounded-3xl flex flex-col items-center justify-center p-8 hover:scale-105 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer aspect-square shadow-2xl group"
              >
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 481 476"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      d="M173.882 107.765C173.882 137.958 214.74 162.515 264.946 162.515C315.153 162.515 356 137.958 356 107.765C356 77.5717 315.269 53.0763 265.161 53L264.703 53.0109C214.623 53.0872 173.878 77.648 173.878 107.765H173.882ZM238.317 89.8721C245.46 85.4207 254.925 82.9643 264.946 82.9643C274.968 82.9643 284.422 85.4207 291.58 89.8721C299.105 94.5524 303.257 100.912 303.257 107.765C303.257 114.618 299.105 120.977 291.58 125.658C284.422 130.109 274.972 132.566 264.946 132.566C254.921 132.566 245.46 130.109 238.317 125.658C230.788 120.977 226.636 114.618 226.636 107.765C226.636 100.912 230.788 94.5488 238.317 89.8721Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M335.633 153.975C316.67 165.766 291.565 172.264 264.946 172.264C238.328 172.264 213.226 165.766 194.26 153.975C185.767 148.684 178.951 142.641 173.882 135.955V182.896C173.882 194.357 179.777 205.001 189.828 213.805V196.984C189.828 194.179 192.113 191.897 194.922 191.897C197.732 191.897 200.017 194.179 200.017 196.984V221.24C207.185 225.63 215.57 229.296 224.842 232.047V212.337C224.842 209.532 227.127 207.25 229.936 207.25C232.745 207.25 235.031 209.532 235.031 212.337V234.609C242.876 236.255 251.202 237.283 259.856 237.57V216.785C259.856 213.98 262.141 211.698 264.95 211.698C267.759 211.698 270.045 213.98 270.045 216.785V237.57C278.694 237.283 287.02 236.255 294.869 234.609V213.049C294.869 210.244 297.155 207.962 299.964 207.962C302.773 207.962 305.058 210.244 305.058 213.049V232.047C314.33 229.3 322.715 225.63 329.883 221.236V198.888C329.883 196.083 332.169 193.801 334.978 193.801C337.787 193.801 340.072 196.083 340.072 198.888V213.794C350.112 204.993 356.004 194.35 356.004 182.893V135.951C350.949 142.641 344.122 148.68 335.636 153.971L335.633 153.975Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M194.26 61.125C199.191 58.0617 204.54 55.3509 210.257 53.0107H125V118.397H163.693V107.765C163.693 89.9591 174.559 73.3854 194.26 61.125Z"
                      fill="#FF0000"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect
                        width="231"
                        height="185"
                        fill="white"
                        transform="translate(125 53)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-wide text-center">
                  Les Tailles
                </h3>
                <p className="text-gray-400 text-sm md:text-base text-center font-light">
                  Trouver la bonne taille selon son corps.
                </p>
              </div>

              {/* Card 2: LES ÉQUIPEMENTS */}
              <div
                onClick={() => navigate("/route-equipements")}
                className="w-[31%] bg-[#151515] rounded-3xl flex flex-col items-center justify-center p-8 hover:scale-105 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer aspect-square shadow-2xl group"
              >
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 481 476"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  <g clipPath="url(#clip1)">
                    <path
                      d="M189.524 53H191.169C204.014 53 214.447 63.4727 214.447 76.3747V214.629C214.447 227.527 204.018 238.004 191.169 238.004H189.524C176.679 238.004 166.246 227.531 166.246 214.629V76.3747C166.246 63.4727 176.679 53 189.524 53Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M158.652 214.625V76.371C158.652 75.8554 158.666 75.3397 158.691 74.8277C156.901 74.2394 154.992 73.9163 153.007 73.9163C142.921 73.9163 134.719 82.152 134.719 92.2834V198.713C134.719 208.841 142.921 217.076 153.007 217.076C154.992 217.076 156.901 216.753 158.691 216.165C158.666 215.653 158.652 215.141 158.652 214.622V214.625Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M127.125 111.831C126.235 111.671 125.324 111.58 124.391 111.58C115.911 111.58 109 118.505 109 127.035V163.969C109 172.495 115.911 179.424 124.391 179.424C125.324 179.424 126.235 179.333 127.125 179.173V111.831Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M290.831 53H292.476C305.321 53 315.754 63.4727 315.754 76.3747V214.629C315.754 227.527 305.325 238.004 292.476 238.004H290.831C277.986 238.004 267.553 227.531 267.553 214.629V76.3747C267.553 63.4763 277.982 53 290.831 53Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M323.348 214.625V76.371C323.348 75.8554 323.334 75.3397 323.309 74.8277C325.099 74.2394 327.008 73.9163 328.993 73.9163C339.079 73.9163 347.281 82.152 347.281 92.2834V198.713C347.281 208.841 339.079 217.076 328.993 217.076C327.008 217.076 325.099 216.753 323.309 216.165C323.334 215.653 323.348 215.141 323.348 214.622V214.625Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M354.875 111.831C355.765 111.671 356.676 111.58 357.609 111.58C366.089 111.58 373 118.505 373 127.035V163.969C373 172.495 366.089 179.424 357.609 179.424C356.676 179.424 355.765 179.333 354.875 179.173V111.831Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M258.722 128.342H223.282V162.658H258.722V128.342Z"
                      fill="#FF0000"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip1">
                      <rect
                        width="264"
                        height="185"
                        fill="white"
                        transform="translate(109 53)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-wide text-center">
                  Les Équipements
                </h3>
                <p className="text-gray-400 text-sm md:text-base text-center font-light">
                  Comprendre chaque équipement et à quoi il sert.
                </p>
              </div>

              {/* Card 3: BIEN DÉBUTER */}
              <div
                onClick={() => navigate("/route-debuter")}
                className="w-[31%] bg-[#151515] rounded-3xl flex flex-col items-center justify-center p-8 hover:scale-105 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer aspect-square shadow-2xl group"
              >
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 481 476"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  <g clipPath="url(#clip2)">
                    <path
                      d="M182.873 142.243L195.276 121.502C196.074 120.162 197.551 119.332 199.133 119.332C199.213 119.332 199.296 119.332 199.376 119.338C201.04 119.427 202.504 120.43 203.204 121.954L218.514 156.175L238.765 95.4912C239.366 93.6678 241.075 92.4395 243.012 92.4395C245.031 92.4618 246.728 93.741 247.291 95.6248L268.136 164.951L277.253 145.374C277.985 143.806 279.582 142.794 281.318 142.794H341.868C346.298 126.339 346.048 109.162 340.993 91.6121C340.954 91.5039 340.919 91.4339 340.919 91.3639C336.142 76.8916 321.701 58.4733 296.708 53.9929C293.634 53.3533 264.975 48.09 240.979 70.4191C217.025 48.0868 188.363 53.3501 185.289 53.9897C160.296 58.4702 145.855 76.8884 141.081 91.3607C141.081 91.4308 141.043 91.5039 141.007 91.609C136.006 108.964 135.712 125.954 139.991 142.243H182.873Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M284.165 151.7L271.29 179.356C270.555 180.925 268.96 181.934 267.231 181.934C267.123 181.934 267.017 181.931 266.908 181.921C265.049 181.788 263.454 180.508 262.94 178.736L242.788 111.685L223.368 169.877C222.786 171.637 221.205 172.836 219.338 172.925L219.121 172.932C217.351 172.932 215.747 171.891 215.034 170.284L198.554 133.448L189.264 148.986C188.427 150.335 186.96 151.153 185.42 151.153H142.822C149.492 169.081 161.852 186.055 179.773 201.587C206.914 225.125 236.946 237.001 238.202 237.465C239.091 237.822 240.052 238 240.979 238C241.906 238 242.906 237.822 243.795 237.465C245.054 237.004 275.083 225.128 302.223 201.587C319.962 186.211 332.253 169.425 338.97 151.697H284.165V151.7Z"
                      fill="#FF0000"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip2">
                      <rect
                        width="208"
                        height="185"
                        fill="white"
                        transform="translate(137 53)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-wide text-center">
                  Bien Débuter
                </h3>
                <p className="text-gray-400 text-sm md:text-base text-center font-light">
                  Conseil sécurité et entraînement.
                </p>
              </div>
            </div>

            <div className="w-full flex justify-end mt-16 lg:mt-24 pr-4">
              <button
                onClick={() => navigate("/guides")}
                className="hover:opacity-80 hover:translate-x-3 transition-all duration-300 flex items-center justify-center cursor-pointer bg-transparent border-none outline-none"
              >
                <svg
                  width="306"
                  height="44"
                  viewBox="0 0 306 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.00568 8.81818L13.3338 28.7102H13.5767L19.9176 8.81818H26.054L17.0284 35H9.89489L0.856534 8.81818H7.00568ZM35.7603 35.3835C33.7745 35.3835 32.0572 34.9616 30.6083 34.1179C29.168 33.2656 28.0558 32.081 27.2717 30.5639C26.4876 29.0384 26.0955 27.2699 26.0955 25.2585C26.0955 23.2301 26.4876 21.4574 27.2717 19.9403C28.0558 18.4148 29.168 17.2301 30.6083 16.3864C32.0572 15.5341 33.7745 15.108 35.7603 15.108C37.7461 15.108 39.4592 15.5341 40.8995 16.3864C42.3484 17.2301 43.4648 18.4148 44.2489 19.9403C45.033 21.4574 45.4251 23.2301 45.4251 25.2585C45.4251 27.2699 45.033 29.0384 44.2489 30.5639C43.4648 32.081 42.3484 33.2656 40.8995 34.1179C39.4592 34.9616 37.7461 35.3835 35.7603 35.3835ZM35.7859 31.1648C36.6893 31.1648 37.4435 30.9091 38.0487 30.3977C38.6538 29.8778 39.1097 29.1705 39.4165 28.2756C39.7319 27.3807 39.8896 26.3622 39.8896 25.2202C39.8896 24.0781 39.7319 23.0597 39.4165 22.1648C39.1097 21.2699 38.6538 20.5625 38.0487 20.0426C37.4435 19.5227 36.6893 19.2628 35.7859 19.2628C34.8739 19.2628 34.1069 19.5227 33.4847 20.0426C32.8711 20.5625 32.4066 21.2699 32.0913 22.1648C31.7844 23.0597 31.631 24.0781 31.631 25.2202C31.631 26.3622 31.7844 27.3807 32.0913 28.2756C32.4066 29.1705 32.8711 29.8778 33.4847 30.3977C34.1069 30.9091 34.8739 31.1648 35.7859 31.1648ZM48.9663 35V15.3636H54.4123V35H48.9663ZM51.7021 12.8324C50.8924 12.8324 50.1978 12.5639 49.6183 12.027C49.0472 11.4815 48.7617 10.8295 48.7617 10.071C48.7617 9.32102 49.0472 8.67756 49.6183 8.14062C50.1978 7.59517 50.8924 7.32244 51.7021 7.32244C52.5117 7.32244 53.2021 7.59517 53.7731 8.14062C54.3526 8.67756 54.6424 9.32102 54.6424 10.071C54.6424 10.8295 54.3526 11.4815 53.7731 12.027C53.2021 12.5639 52.5117 12.8324 51.7021 12.8324ZM58.7749 35V15.3636H64.0547V18.7898H64.2592C64.6172 17.571 65.218 16.6506 66.0618 16.0284C66.9055 15.3977 67.8771 15.0824 68.9766 15.0824C69.2493 15.0824 69.5433 15.0994 69.8587 15.1335C70.174 15.1676 70.451 15.2145 70.6896 15.2741V20.1065C70.4339 20.0298 70.0803 19.9616 69.6286 19.902C69.1768 19.8423 68.7635 19.8125 68.3885 19.8125C67.5874 19.8125 66.8714 19.9872 66.2408 20.3366C65.6186 20.6776 65.1243 21.1548 64.7578 21.7685C64.3999 22.3821 64.2209 23.0895 64.2209 23.8906V35H58.7749ZM87.2834 8.81818V35H81.8374V8.81818H87.2834ZM100.595 35.3835C98.5749 35.3835 96.8363 34.9744 95.3789 34.1562C93.93 33.3295 92.8136 32.1619 92.0295 30.6534C91.2454 29.1364 90.8533 27.3423 90.8533 25.2713C90.8533 23.2514 91.2454 21.4787 92.0295 19.9531C92.8136 18.4276 93.9173 17.2386 95.3406 16.3864C96.7724 15.5341 98.4513 15.108 100.377 15.108C101.673 15.108 102.879 15.3168 103.995 15.7344C105.12 16.1435 106.1 16.7614 106.936 17.5881C107.779 18.4148 108.436 19.4545 108.904 20.7074C109.373 21.9517 109.608 23.4091 109.608 25.0795V26.5753H93.0266V23.2003H104.481C104.481 22.4162 104.311 21.7216 103.97 21.1165C103.629 20.5114 103.156 20.0384 102.551 19.6974C101.954 19.348 101.26 19.1733 100.467 19.1733C99.6403 19.1733 98.9073 19.3651 98.2681 19.7486C97.6374 20.1236 97.1431 20.6307 96.7852 21.2699C96.4272 21.9006 96.244 22.6037 96.2354 23.3793V26.5881C96.2354 27.5597 96.4144 28.3991 96.7724 29.1065C97.1388 29.8139 97.6545 30.3594 98.3192 30.7429C98.984 31.1264 99.7724 31.3182 100.684 31.3182C101.289 31.3182 101.843 31.233 102.346 31.0625C102.849 30.892 103.279 30.6364 103.637 30.2955C103.995 29.9545 104.268 29.5369 104.456 29.0426L109.493 29.375C109.237 30.5852 108.713 31.642 107.92 32.5455C107.136 33.4403 106.122 34.1392 104.877 34.642C103.642 35.1364 102.214 35.3835 100.595 35.3835ZM129.5 20.9631L124.514 21.2699C124.429 20.8437 124.245 20.4602 123.964 20.1193C123.683 19.7699 123.312 19.4929 122.852 19.2884C122.4 19.0753 121.859 18.9688 121.228 18.9688C120.385 18.9688 119.673 19.1477 119.093 19.5057C118.514 19.8551 118.224 20.3239 118.224 20.9119C118.224 21.3807 118.412 21.777 118.787 22.1009C119.162 22.4247 119.805 22.6847 120.717 22.8807L124.271 23.5966C126.18 23.9886 127.603 24.6193 128.541 25.4886C129.478 26.358 129.947 27.5 129.947 28.9148C129.947 30.2017 129.568 31.331 128.809 32.3026C128.059 33.2741 127.028 34.0327 125.716 34.5781C124.412 35.1151 122.907 35.3835 121.203 35.3835C118.603 35.3835 116.532 34.8423 114.99 33.7599C113.456 32.669 112.556 31.1861 112.292 29.3111L117.649 29.0298C117.811 29.8224 118.203 30.4276 118.825 30.8452C119.447 31.2543 120.244 31.4588 121.216 31.4588C122.17 31.4588 122.937 31.2756 123.517 30.9091C124.105 30.5341 124.403 30.0526 124.412 29.4645C124.403 28.9702 124.194 28.5653 123.785 28.25C123.376 27.9261 122.745 27.679 121.893 27.5085L118.493 26.831C116.575 26.4474 115.147 25.7827 114.21 24.8366C113.281 23.8906 112.816 22.6847 112.816 21.2188C112.816 19.9574 113.157 18.8707 113.839 17.9588C114.529 17.0469 115.497 16.3438 116.741 15.8494C117.994 15.3551 119.46 15.108 121.139 15.108C123.619 15.108 125.571 15.6321 126.994 16.6804C128.426 17.7287 129.261 19.1562 129.5 20.9631ZM150.555 42.7727C148.791 42.7727 147.278 42.5298 146.017 42.044C144.764 41.5668 143.767 40.9148 143.025 40.0881C142.284 39.2614 141.802 38.3324 141.581 37.3011L146.618 36.6236C146.771 37.0156 147.014 37.3821 147.346 37.723C147.679 38.0639 148.118 38.3366 148.663 38.5412C149.217 38.7543 149.89 38.8608 150.683 38.8608C151.868 38.8608 152.843 38.571 153.61 37.9915C154.386 37.4205 154.774 36.4616 154.774 35.1151V31.5227H154.544C154.305 32.0682 153.947 32.5838 153.47 33.0696C152.993 33.5554 152.379 33.9517 151.629 34.2585C150.879 34.5653 149.984 34.7188 148.944 34.7188C147.47 34.7188 146.127 34.3778 144.917 33.696C143.716 33.0057 142.757 31.9531 142.041 30.5384C141.333 29.1151 140.98 27.3168 140.98 25.1435C140.98 22.919 141.342 21.0611 142.066 19.5696C142.791 18.0781 143.754 16.9616 144.956 16.2202C146.166 15.4787 147.491 15.108 148.931 15.108C150.031 15.108 150.951 15.2955 151.693 15.6705C152.434 16.0369 153.031 16.4972 153.483 17.0511C153.943 17.5966 154.297 18.1335 154.544 18.6619H154.748V15.3636H160.156V35.1918C160.156 36.8622 159.747 38.2599 158.929 39.3849C158.11 40.5099 156.977 41.3537 155.528 41.9162C154.088 42.4872 152.43 42.7727 150.555 42.7727ZM150.67 30.6278C151.548 30.6278 152.289 30.4105 152.895 29.9759C153.508 29.5327 153.977 28.902 154.301 28.0838C154.633 27.2571 154.799 26.2685 154.799 25.1179C154.799 23.9673 154.637 22.9702 154.314 22.1264C153.99 21.2741 153.521 20.6136 152.907 20.1449C152.294 19.6761 151.548 19.4418 150.67 19.4418C149.775 19.4418 149.021 19.6847 148.407 20.1705C147.794 20.6477 147.329 21.3125 147.014 22.1648C146.699 23.017 146.541 24.0014 146.541 25.1179C146.541 26.2514 146.699 27.2315 147.014 28.0582C147.338 28.8764 147.802 29.5114 148.407 29.9631C149.021 30.4062 149.775 30.6278 150.67 30.6278ZM177.082 26.6392V15.3636H182.528V35H177.299V31.4332H177.095C176.652 32.5838 175.914 33.5085 174.883 34.2074C173.86 34.9062 172.612 35.2557 171.137 35.2557C169.825 35.2557 168.67 34.9574 167.673 34.3608C166.676 33.7642 165.896 32.9162 165.333 31.8168C164.779 30.7173 164.498 29.4006 164.49 27.8665V15.3636H169.936V26.8949C169.944 28.054 170.255 28.9702 170.869 29.6435C171.483 30.3168 172.305 30.6534 173.336 30.6534C173.993 30.6534 174.606 30.5043 175.177 30.206C175.748 29.8991 176.208 29.4474 176.558 28.8509C176.916 28.2543 177.091 27.517 177.082 26.6392ZM186.884 35V15.3636H192.33V35H186.884ZM189.62 12.8324C188.81 12.8324 188.116 12.5639 187.536 12.027C186.965 11.4815 186.68 10.8295 186.68 10.071C186.68 9.32102 186.965 8.67756 187.536 8.14062C188.116 7.59517 188.81 7.32244 189.62 7.32244C190.43 7.32244 191.12 7.59517 191.691 8.14062C192.271 8.67756 192.56 9.32102 192.56 10.071C192.56 10.8295 192.271 11.4815 191.691 12.027C191.12 12.5639 190.43 12.8324 189.62 12.8324ZM203.929 35.3196C202.437 35.3196 201.086 34.9361 199.876 34.169C198.674 33.3935 197.72 32.2557 197.012 30.7557C196.314 29.2472 195.964 27.3977 195.964 25.2074C195.964 22.9574 196.326 21.0866 197.051 19.5952C197.775 18.0952 198.738 16.9744 199.94 16.233C201.15 15.483 202.475 15.108 203.916 15.108C205.015 15.108 205.931 15.2955 206.664 15.6705C207.406 16.0369 208.002 16.4972 208.454 17.0511C208.914 17.5966 209.264 18.1335 209.502 18.6619H209.669V8.81818H215.102V35H209.733V31.8551H209.502C209.247 32.4006 208.885 32.9418 208.416 33.4787C207.956 34.0071 207.355 34.446 206.613 34.7955C205.88 35.1449 204.985 35.3196 203.929 35.3196ZM205.654 30.9858C206.532 30.9858 207.274 30.7472 207.879 30.2699C208.493 29.7841 208.961 29.1065 209.285 28.2372C209.618 27.3679 209.784 26.3494 209.784 25.1818C209.784 24.0142 209.622 23 209.298 22.1392C208.974 21.2784 208.505 20.6136 207.892 20.1449C207.278 19.6761 206.532 19.4418 205.654 19.4418C204.76 19.4418 204.005 19.6847 203.392 20.1705C202.778 20.6562 202.314 21.3295 201.998 22.1903C201.683 23.0511 201.525 24.0483 201.525 25.1818C201.525 26.3239 201.683 27.3338 201.998 28.2116C202.322 29.081 202.787 29.7628 203.392 30.2571C204.005 30.7429 204.76 30.9858 205.654 30.9858ZM228.528 35.3835C226.509 35.3835 224.77 34.9744 223.312 34.1562C221.864 33.3295 220.747 32.1619 219.963 30.6534C219.179 29.1364 218.787 27.3423 218.787 25.2713C218.787 23.2514 219.179 21.4787 219.963 19.9531C220.747 18.4276 221.851 17.2386 223.274 16.3864C224.706 15.5341 226.385 15.108 228.311 15.108C229.607 15.108 230.813 15.3168 231.929 15.7344C233.054 16.1435 234.034 16.7614 234.869 17.5881C235.713 18.4148 236.369 19.4545 236.838 20.7074C237.307 21.9517 237.541 23.4091 237.541 25.0795V26.5753H220.96V23.2003H232.415C232.415 22.4162 232.244 21.7216 231.903 21.1165C231.563 20.5114 231.089 20.0384 230.484 19.6974C229.888 19.348 229.193 19.1733 228.401 19.1733C227.574 19.1733 226.841 19.3651 226.202 19.7486C225.571 20.1236 225.077 20.6307 224.719 21.2699C224.361 21.9006 224.178 22.6037 224.169 23.3793V26.5881C224.169 27.5597 224.348 28.3991 224.706 29.1065C225.072 29.8139 225.588 30.3594 226.253 30.7429C226.918 31.1264 227.706 31.3182 228.618 31.3182C229.223 31.3182 229.777 31.233 230.28 31.0625C230.783 30.892 231.213 30.6364 231.571 30.2955C231.929 29.9545 232.202 29.5369 232.389 29.0426L237.426 29.375C237.17 30.5852 236.646 31.642 235.854 32.5455C235.07 33.4403 234.055 34.1392 232.811 34.642C231.575 35.1364 230.148 35.3835 228.528 35.3835ZM257.433 20.9631L252.447 21.2699C252.362 20.8437 252.179 20.4602 251.898 20.1193C251.616 19.7699 251.246 19.4929 250.786 19.2884C250.334 19.0753 249.793 18.9688 249.162 18.9688C248.318 18.9688 247.607 19.1477 247.027 19.5057C246.447 19.8551 246.158 20.3239 246.158 20.9119C246.158 21.3807 246.345 21.777 246.72 22.1009C247.095 22.4247 247.739 22.6847 248.651 22.8807L252.205 23.5966C254.114 23.9886 255.537 24.6193 256.474 25.4886C257.412 26.358 257.881 27.5 257.881 28.9148C257.881 30.2017 257.501 31.331 256.743 32.3026C255.993 33.2741 254.962 34.0327 253.649 34.5781C252.345 35.1151 250.841 35.3835 249.136 35.3835C246.537 35.3835 244.466 34.8423 242.923 33.7599C241.389 32.669 240.49 31.1861 240.226 29.3111L245.582 29.0298C245.744 29.8224 246.136 30.4276 246.759 30.8452C247.381 31.2543 248.178 31.4588 249.149 31.4588C250.104 31.4588 250.871 31.2756 251.45 30.9091C252.038 30.5341 252.337 30.0526 252.345 29.4645C252.337 28.9702 252.128 28.5653 251.719 28.25C251.31 27.9261 250.679 27.679 249.827 27.5085L246.426 26.831C244.509 26.4474 243.081 25.7827 242.143 24.8366C241.214 23.8906 240.75 22.6847 240.75 21.2188C240.75 19.9574 241.091 18.8707 241.773 17.9588C242.463 17.0469 243.43 16.3438 244.675 15.8494C245.928 15.3551 247.393 15.108 249.072 15.108C251.553 15.108 253.504 15.6321 254.928 16.6804C256.359 17.7287 257.195 19.1562 257.433 20.9631Z"
                    fill="#FF0000"
                  />
                  <path
                    d="M305.414 25.4142C306.195 24.6332 306.195 23.3668 305.414 22.5858L292.686 9.85786C291.905 9.07682 290.639 9.07682 289.858 9.85786C289.077 10.6389 289.077 11.9052 289.858 12.6863L301.172 24L289.858 35.3137C289.077 36.0948 289.077 37.3611 289.858 38.1421C290.639 38.9232 291.905 38.9232 292.686 38.1421L305.414 25.4142ZM276 24V26H304V24V22H276V24Z"
                    fill="#FF0000"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
        {/* ================= SECTION NOTRE SÉLECTION ================= */}
        <section className="w-full bg-black py-16 flex justify-center">
          <div className="w-full max-w-[1300px] px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide mb-12 w-full text-left">
              NOTRE SELECTION
            </h2>

            {/* Ajout du style inline pour forcer l'écart de 30px */}
            <div
              className="flex flex-row w-full overflow-hidden"
              style={{ gap: "30px" }}
            >
              {[
                {
                  id: "1",
                  marque: "CASQUE Venum",
                  desc: "L - Neuf",
                  prix: "30€",
                },
                { id: "2", marque: "GANTS", desc: "12 oz - Neuf", prix: "15€" },
                {
                  id: "3",
                  marque: "PROTÈGE DENTS",
                  desc: "Adulte - Neuf",
                  prix: "8€",
                },
                {
                  id: "4",
                  marque: "PROTÈGE PIEDS",
                  desc: "M - Très Bon État",
                  prix: "25€",
                },
                {
                  id: "5",
                  marque: "ENSEMBLE Vénu",
                  desc: "M - Très Bon État",
                  prix: "25€",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col cursor-pointer group"
                  onClick={() => navigate(`/articles/${item.id}`)}
                >
                  <div className="w-full aspect-square bg-[#555555] relative mb-5 rounded-sm">
                    {/* Badge Check */}
                    <div className="absolute -top-3 -right-3 z-10 bg-black rounded-full w-8 h-8 flex items-center justify-center">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <path
                          d="M7 12L10.5 15.5L17.5 8.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {/* Coeur */}
                    <div className="absolute bottom-2 right-2 z-10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="black"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col px-1">
                    <h3 className="text-white font-bold text-[14px] uppercase leading-tight truncate">
                      {item.marque}
                    </h3>
                    <p className="text-[#a0a0a0] text-[12px] font-light mt-1 truncate">
                      {item.desc}
                    </p>
                    <p className="text-white font-bold text-[16px] mt-2">
                      {item.prix}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full border-b border-[#222] mt-20"></div>
          </div>
        </section>
        {/* ================= SECTION TON MATÉRIEL ================= */}
        <section className="w-full bg-black py-24 flex justify-center">
          <div className="w-full max-w-[1300px] px-8 flex flex-col">
            {/* Titre XXL */}
            <h2 className="text-[50px] lg:text-[85px] font-black text-white uppercase tracking-tight leading-[1.05] mb-16 text-left">
              TON MATÉRIEL PEUT
              <br />
              <span className="text-[#ff0000]">ENCORE</span> FAIRE DES
              <br />
              ROUNDS
            </h2>

            {/* Conteneur aligné en bas */}
            <div className="flex flex-row justify-between items-end w-full">
              {/* Grille des badges (SVG en fond + Texte superposé plus gros et en gras) */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6 w-[65%]">
                {/* Badge 1 : GAGNE DE L'ARGENT */}
                <div className="relative flex items-center justify-center w-full">
                  <svg
                    viewBox="0 0 408 92"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                  >
                    <rect
                      x="1.5"
                      y="1.5"
                      width="405"
                      height="89"
                      rx="44.5"
                      stroke="#A6A6A6"
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                    GAGNE DE L'ARGENT
                  </span>
                </div>

                {/* Badge 2 : AIDE UN BOXEUR */}
                <div className="relative flex items-center justify-center w-full">
                  <svg
                    viewBox="0 0 351 92"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                  >
                    <rect
                      x="1.5"
                      y="1.5"
                      width="348"
                      height="89"
                      rx="44.5"
                      stroke="#A6A6A6"
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                    AIDE UN BOXEUR
                  </span>
                </div>

                {/* Badge 3 : ÉVITE LE GASPILLAGE */}
                <div className="relative flex items-center justify-center w-full">
                  <svg
                    viewBox="0 0 428 92"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                  >
                    <rect
                      x="1.5"
                      y="1.5"
                      width="425"
                      height="89"
                      rx="44.5"
                      stroke="#A6A6A6"
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                    ÉVITE LE GASPILLAGE
                  </span>
                </div>

                {/* Badge 4 : VENTE SIMPLE ET RAPIDE */}
                <div className="relative flex items-center justify-center w-full">
                  <svg
                    viewBox="0 0 475 92"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                  >
                    <rect
                      x="1.5"
                      y="1.5"
                      width="472"
                      height="89"
                      rx="44.5"
                      stroke="#A6A6A6"
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute text-white text-[14px] lg:text-[22px] font-bold tracking-widest whitespace-nowrap">
                    VENTE SIMPLE ET RAPIDE
                  </span>
                </div>
              </div>

              {/* Bouton Rouge (Fond transparent forcé pour tuer le carré blanc) */}
              <button
                onClick={() => {
                  console.log("Redirection vers la page de revente");
                  // navigate('/sell');
                }}
                className="bg-transparent border-none outline-none p-0 w-[28%] max-w-[286px] cursor-pointer hover:opacity-80 transition-opacity ml-auto"
              >
                <svg
                  viewBox="0 0 286 92"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto block"
                >
                  <rect
                    x="1.5"
                    y="1.5"
                    width="283"
                    height="89"
                    rx="44.5"
                    fill="#FF0000"
                    stroke="#FF0000"
                    strokeWidth="3"
                  />
                  <path
                    d="M257.414 47.4142C258.195 46.6332 258.195 45.3668 257.414 44.5858L244.686 31.8579C243.905 31.0768 242.639 31.0768 241.858 31.8579C241.077 32.6389 241.077 33.9052 241.858 34.6863L253.172 46L241.858 57.3137C241.077 58.0948 241.077 59.3611 241.858 60.1421C242.639 60.9232 243.905 60.9232 244.686 60.1421L257.414 47.4142ZM228 46V48H256V46V44H228V46Z"
                    fill="white"
                  />
                  <path
                    d="M37.7614 58V34.7273H47.375C49.1174 34.7273 50.6212 35.0417 51.8864 35.6705C53.1591 36.2917 54.1402 37.1856 54.8295 38.3523C55.5189 39.5114 55.8636 40.8864 55.8636 42.4773C55.8636 44.0909 55.5114 45.4621 54.8068 46.5909C54.1023 47.7121 53.1023 48.5682 51.8068 49.1591C50.5114 49.7424 48.9773 50.0341 47.2045 50.0341H41.125V45.6023H46.1591C47.0076 45.6023 47.7159 45.4924 48.2841 45.2727C48.8598 45.0455 49.2955 44.7045 49.5909 44.25C49.8864 43.7879 50.0341 43.197 50.0341 42.4773C50.0341 41.7576 49.8864 41.1629 49.5909 40.6932C49.2955 40.2159 48.8598 39.8598 48.2841 39.625C47.7083 39.3826 47 39.2614 46.1591 39.2614H43.3864V58H37.7614ZM50.8636 47.3636L56.6591 58H50.5227L44.8409 47.3636H50.8636ZM58.9489 58V34.7273H75.1761V39.2955H64.5739V44.0682H74.3466V48.6477H64.5739V53.4318H75.1761V58H58.9489ZM83.983 34.7273L89.1875 51.7727H89.3807L94.5852 34.7273H100.881L93.0284 58H85.5398L77.6875 34.7273H83.983ZM103.386 58V34.7273H119.614V39.2955H109.011V44.0682H118.784V48.6477H109.011V53.4318H119.614V58H103.386ZM142.943 34.7273V58H138.17L128.909 44.5682H128.761V58H123.136V34.7273H127.977L137.136 48.1364H137.33V34.7273H142.943ZM155.082 58H146.48V34.7273H155.071C157.442 34.7273 159.484 35.1932 161.196 36.125C162.916 37.0492 164.241 38.3826 165.173 40.125C166.105 41.8598 166.571 43.9356 166.571 46.3523C166.571 48.7765 166.105 50.8598 165.173 52.6023C164.249 54.3447 162.927 55.6818 161.207 56.6136C159.488 57.5379 157.446 58 155.082 58ZM152.105 53.2045H154.866C156.17 53.2045 157.272 52.9848 158.173 52.5455C159.082 52.0985 159.768 51.375 160.23 50.375C160.7 49.3674 160.935 48.0265 160.935 46.3523C160.935 44.678 160.7 43.3447 160.23 42.3523C159.76 41.3523 159.067 40.6326 158.151 40.1932C157.241 39.7462 156.12 39.5227 154.787 39.5227H152.105V53.2045ZM169.855 58V34.7273H179.469C181.211 34.7273 182.715 35.0417 183.98 35.6705C185.253 36.2917 186.234 37.1856 186.923 38.3523C187.613 39.5114 187.957 40.8864 187.957 42.4773C187.957 44.0909 187.605 45.4621 186.901 46.5909C186.196 47.7121 185.196 48.5682 183.901 49.1591C182.605 49.7424 181.071 50.0341 179.298 50.0341H173.219V45.6023H178.253C179.101 45.6023 179.81 45.4924 180.378 45.2727C180.954 45.0455 181.389 44.7045 181.685 44.25C181.98 43.7879 182.128 43.197 182.128 42.4773C182.128 41.7576 181.98 41.1629 181.685 40.6932C181.389 40.2159 180.954 39.8598 180.378 39.625C179.802 39.3826 179.094 39.2614 178.253 39.2614H175.48V58H169.855ZM182.957 47.3636L188.753 58H182.616L176.935 47.3636H182.957ZM191.043 58V34.7273H207.27V39.2955H196.668V44.0682H206.44V48.6477H196.668V53.4318H207.27V58H191.043Z"
                    fill="#E9E9E9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
        {/* ================= FOOTER ================= */}
        <footer className="w-full bg-black pt-28 pb-24 flex justify-center border-t border-[#333] mt-24">
          <div className="w-full max-w-[1300px] px-8 flex flex-col">
            {/* LIGNE 1 : Logo & Titres (FORCÉ à 4 colonnes) */}
            <div className="grid grid-cols-4 gap-8 items-end mb-16">
              {/* Colonne 1 : Logo */}
              <div>
                <img
                  src={LOGO_URL}
                  alt="2ROUND Logo"
                  className="w-[180px] h-auto object-contain -ml-2"
                />
              </div>
              {/* Colonne 2 : Vide pour créer l'espace */}
              <div></div>
              {/* Colonne 3 : Titre 1 */}
              <div>
                <h3 className="text-white font-bold text-[18px] uppercase tracking-wider mb-2">
                  MON ROUND PERSO
                </h3>
              </div>
              {/* Colonne 4 : Titre 2 */}
              <div>
                <h3 className="text-white font-bold text-[18px] uppercase tracking-wider mb-2">
                  MON VESTIAIRE
                </h3>
              </div>
            </div>

            {/* LIGNE 2 : Première rangée de liens (FORCÉ à 4 colonnes) */}
            <div className="grid grid-cols-4 gap-8 mb-6">
              <span
                onClick={() => navigate("/login")}
                className="text-white font-bold text-[17px] uppercase tracking-wider cursor-pointer hover:text-[#ff0000] transition-colors"
              >
                CRÉER MON PROFIL
              </span>
              <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
                Les Packs
              </span>
              <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
                Pack personnalisé
              </span>
              <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
                Articles
              </span>
            </div>

            {/* LIGNE 3 : Deuxième rangée de liens (FORCÉ à 4 colonnes) */}
            <div className="grid grid-cols-4 gap-8">
              <span
                onClick={() => navigate("/sell")}
                className="text-white font-bold text-[17px] uppercase tracking-wider cursor-pointer hover:text-[#ff0000] transition-colors"
              >
                COMMENCER À VENDRE
              </span>
              <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
                Les Guides
              </span>
              <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
                Favoris
              </span>
              <span className="text-[#f0f0f0] font-normal text-[17px] cursor-pointer hover:text-[#ff0000] transition-colors">
                Évaluations
              </span>
            </div>
          </div>
        </footer>{" "}
      </div>
    );
  }

  // Utilisateur connecté : Catalogue classique
  return (
    <section className="w-full bg-black px-4 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8">
          Les articles disponibles
        </h2>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 text-white mb-12"
        />
        {loading ? (
          <div className="text-white text-center">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredArticles.map((a) => (
              <div
                key={a.id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-[#ff0000] transition"
              >
                <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-600">
                  {a.categorie}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white">{a.marque}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-[#ff0000]">
                      {a.prix}€
                    </span>
                    <Link
                      to={`/articles/${a.id}`}
                      className="bg-[#ff0000] text-white px-4 py-2 rounded font-bold hover:bg-red-700"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
