// src/pages/HomePage/HomePage.jsx
// Главная страница с добавленным BlogSlider и FAQ

"use client"
import Hero from "./Hero/Hero"
import Sliders from "../../components/Sliders/Sliders"
import BlogSlider from "../../components/BlogSlider/BlogSlider"
import FAQ from "../../components/FAQ/FAQ"
import HomeAdvantages from "./HomeAdvantages/HomeAdvantages"

const HomePage = ({ blogPosts = [], faqs = [] }) => {

	return (
		<main>
			<Hero />
			<Sliders types={["popular"]} title={"Populárne tovary v obchode Mobilend"} />
			{/* <Sliders types={["discount"]} title={"Tovary so zľavou - ušetrite už dnes!"} />
			// <Sliders types={["model"]} model={"Iphones"} title={"Najnovšie modely iPhone"} /> */} 
			<Sliders types={["model"]} model={"Samsung Galaxy"} title={"Samsung Galaxy - prémiové smartfóny"} />

			{/* Блог секция - показываем только если есть статьи */}
			{blogPosts.length > 0 && (
				<BlogSlider
					posts={blogPosts}
					title="Naše najnovšie články"
					subtitle="Prečítajte si užitočné tipy a recenzie o mobilných telefónoch"
					className="BlogSlider--large"
					cardVariant="compact"
					slidesToShow={3}
					autoplay={true}
				/>
			)}

			<HomeAdvantages />

			{/* FAQ секция - показываем только топ 4 вопроса */}
			{faqs.length > 0 && (
				<FAQ
					faqs={faqs}
					title="Často kladené otázky"
					subtitle="Odpovede na najčastejšie otázky o nákupe mobilných telefónov"
					className="FAQ--compact"
					limit={4}
				/>
			)}
		</main>
	)
}

export default HomePage