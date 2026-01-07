"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import "./SliderList.scss"

const SliderList = ({ list }) => {

    return (
        <div className="SliderList">
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper SliderList-Swipper"
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                }}
            >
                {
                    list.map((el, index) => {
                        const IconComponent = el.icon
                        return <SwiperSlide key={index}>
                            <div key={index} className="SliderList__card">
                                <div className="SliderList__card-icon">
                                    <IconComponent size={28} />
                                </div>
                                <h3 className="SliderList__card-title">
                                    {el.title}
                                </h3>
                                <p className="SliderList__card-description">
                                    {el.description}
                                </p>
                            </div>
                        </SwiperSlide>
                    })
                }
            </Swiper>
        </div>
    )
}

export default SliderList


