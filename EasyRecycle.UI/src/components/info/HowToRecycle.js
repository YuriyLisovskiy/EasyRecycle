import React, {Component} from "react";

export default class HowToRecycleComponent extends Component {

	constructor(props) {
		super(props);
		this.placeImgLeft = false;
		this.garbageTypesData = [
			{
				content: {
					id: "organic",
					title: "Organic (Food) Waste*",
					paragraphs: [
						{
							title: "Overview",
							text: [
								"The best thing that can happen to food is that it makes it to our plates and is enjoyed. Avoiding throwing out food that could have been eaten will save you money and help reduce greenhouse gas emissions. However some food waste is inevitable - egg shells, banana skins and tea bags are never going to be on the menu."
							]
						},
						{
							title: "How is it recycled?",
							text: [
								"Many councils now collect food waste, which can be recycled in several ways including:",
								"1) In-vessel composting involves mixing food waste with garden waste – shredding it and then composting it in an enclosed systemfor around 2-4 weeks (temperatures of up to 70°C speed up the process and ensure any harmful  microbes are killed off). The material is then left outside to mature for a further 1-3 months with regular turning and checks to ensure quality before going on to be used as soil conditioner.",
								"2) Anaerobic Digestion uses microorganisms  to break down food waste, animal manure, slurries and energy crops in the absence of oxygen, inside an enclosed system. As it breaks down it gives off methane, which is collected and converted into biogas and used to generate electricity, heat or transport fuels. It also creates a nutrient-rich digestate that can be used as a fertiliser for agriculture and in land regeneration."
							]
						}
					],
					footer: "*Original article: https://www.recyclenow.com/recycling-knowledge/how-is-it-recycled/food-waste"
				},
				image: "/organic-waste.png",
				placeImgLeft: false
			},
			{
				content: {
					id: "glass",
					title: "Glass Waste*",
					paragraphs: [
						{
							title: "Overview",
							text: [
								"Glass recycling is the processing of waste glass into usable products. Glass that is crushed and ready to be remelted is called cullet. There are two types of cullet: internal and external. Internal cullet is composed of defective products detected and rejected by a quality control process during the industrial process of glass manufacturing, transition phases of product changes (such as thickness and colour changes) and production offcuts. External cullet is waste glass that has been collected or reprocessed with the purpose of recycling. External cullet (which can be pre- or post-consumer) is classified as waste. The word \"cullet\", when used in the context of end-of-waste, will always refer to external cullet.",
								"To be recycled, glass waste needs to be purified and cleaned of contamination. Then, depending on the end use and local processing capabilities, it might also have to be separated into different colors. Many recyclers collect different colors of glass separately since glass retains its color after recycling. The most common colours used for consumer containers are clear (flint) glass, green glass, and brown (amber) glass. Glass is ideal for recycling since none of the material is degraded by normal use.",
								"Many collection points have separate bins for clear (flint), green and brown (amber). Glass re-processors intending to make new glass containers require separation by color, because glass tends to retain its color after recycling. If the recycled glass is not going to be made into more glass, or if the glass re-processor uses newer optical sorting equipment, separation by color at the collection point may not be required. Heat-resistant glass, such as Pyrex or borosilicate glass, must not be part of the glass recycling stream, because even a small piece of such material will alter the viscosity of the fluid in the furnace at remelt."
							]
						}
					],
					footer: "*Original article: https://en.wikipedia.org/wiki/Glass_recycling"
				},
				image: "/glass-waste.png",
				placeImgLeft: true
			},
			{
				content: {
					id: "metal",
					title: "Metal Waste*",
					paragraphs: [
						{
							title: "Collection",
							text: [
								"The collection process for metals differs than that for other materials because of higher scrap value. As such, it is more likely to be sold to scrap yards than sent to the landfill. The largest source of scrap ferrous metal in the U.S. is from scrap vehicles.",
								"Other sources include large steel structures, railroad tracks, ships, farm equipment, and of course, consumer scrap. Prompt scrap, which is created in the course of new product manufacturing, accounts for one-half of ferrous scrap supply."
							]
						},
						{
							title: "Sorting",
							text: [
								"Sorting involves separating metals from the mixed scrap metal stream or the mixed multi-material waste stream. In automated recycling operations, magnets and sensors are used to aid in material separation.",
								"At the entrepreneurial level, scrappers may employ a magnet, as well as to observe the material color or weight to help determine the metal type. For example, aluminum will be silver and light. Other important colors to look for are copper, yellow (for brass) and red, for red brass. Scrappers will improve the value of their material by segregating clean metal from the dirty material."
							]
						},
						{
							title: "Processing",
							text: [
								"To allow further processing, metals are shredded. Shredding is done to promote the melting process as small shredded metals have a large surface to volume ratio. As a result, they can be melted using comparatively less energy. Normally, aluminum is converted into small sheets, and steel is changed into steel blocks."
							]
						},
						{
							title: "Melting",
							text: [
								"Scrap metal is melted in a large furnace. Each metal is taken to a specific furnace designed to melt that particular metal. A considerable amount of energy is used in this step. Still, as mentioned above, the energy required to melt and recycle metals is much less than the energy that is needed to produce metals using virgin raw materials. Based on the size of the furnace, the degree of heat of the furnace and volume of metal, melting can take from just a few minutes to hours."
							]
						},
						{
							title: "Purification",
							text: [
								"Purification is done to ensure the final product is of high quality and free of contaminants. One of the most common methods used for purification is Electrolysis."
							]
						},
						{
							title: "Solidifying",
							text: [
								"After purification, melted metals are carried by the conveyor belt to cool and solidify the metals. In this stage, scrap metals are formed into specific shapes such as bars that can be easily used for the production of various metal products."
							]
						},
						{
							title: "Transportation of the Metal Bars",
							text: [
								"Once the metals are cooled and solidified, they are ready to use. They are then transported to various factories where they are used as raw material for the production of brand new products.",
								"When the products made of these metal bars come to the end of their useful life, the metal recycling process cycles again."
							]
						}
					],
					footer: "*Original article: https://www.thebalancesmb.com/an-introduction-to-metal-recycling-4057469"
				},
				image: "/metal-waste.png",
				placeImgLeft: false
			},
			{
				content: {
					id: "paper",
					title: "Paper Waste*",
					paragraphs: [
						{
							title: "Overview",
							text: [
								"There are three categories of paper that can be used as feedstocks for making recycled paper: mill broke, pre-consumer waste, and post-consumer waste. Mill broke is paper trimmings and other paper scrap from the manufacture of paper, and is recycled in a paper mill. Pre-consumer waste is a material which left the paper mill but was discarded before it was ready for consumer use. Post-consumer waste is material discarded after consumer use, such as old corrugated containers (OCC), old magazines, and newspapers. Paper suitable for recycling is called \"scrap paper\", often used to produce moulded pulp packaging. The industrial process of removing printing ink from paper fibres of recycled paper to make deinked pulp is called deinking, an invention of the German jurist Justus Claproth."
							]
						},
						{
							title: "Processing",
							text: [
								"The process of waste paper recycling most often involves mixing used/old paper with water and chemicals to break it down. It is then chopped up and heated, which breaks it down further into strands of cellulose, a type of organic plant material; this resulting mixture is called pulp, or slurry. It is strained through screens, which remove plastic (especially from plastic-coated paper) that may still be in the mixture then cleaned, de-inked (ink is removed), bleached, and mixed with water. Then it can be made into new recycled paper.",
								"The share of ink in a wastepaper stock is up to about 2% of the total weight."
							]
						}
					],
					footer: "*Original article: https://en.wikipedia.org/wiki/Paper_recycling"
				},
				image: "/paper-waste.png",
				placeImgLeft: true
			},
			{
				content: {
					id: "plastic",
					title: "Plastic Waste*",
					paragraphs: [
						{
							title: "Overview",
							text: [
								"Broadly, there are two major ways to recycle plastic: (1) mechanical recycling (\"chop and wash\"), where the plastic is washed, ground into powders and melted, and (2) chemical recycling, where the plastic is broken down into monomers.",
								"Before recycling, most plastics are sorted according to their resin type. In the past, plastic reclaimers used the resin identification code (RIC), a method of categorization of polymer types, which was developed by the Society of the Plastics Industry in 1988. Polyethylene terephthalate, commonly referred to as PET, for instance, has a resin code of 1. Most plastic reclaimers do not rely on the RIC now; they use various sorting systems to identify the resin, ranging from manual sorting and picking of plastic materials to automated mechanical processes that involve shredding, sieving, separation by density, air, liquid, or magnetic, and complex spectrophotometric distribution technologies e.g. UV/VIS, NIR, laser, etc. Some plastic products are also separated by color before they are recycled.",
								"After sorting, for mechanical recycling the plastic recyclables are then shredded. These shredded fragments then undergo processes to eliminate impurities like paper labels. This material is melted and often extruded into the form of pellets which are then used to manufacture other products. The highest quality purification may be referred to as \"regeneration\"."
							]
						},
						{
							title: "Thermal depolymerization",
							text: [
								"Scientists have estimated that the potential commodity value of waste plastic may be in excess of $300 per ton when used in process pathways yielding high-value chemical products or to produce electricity in efficient IGCC (Integrated Gasification Combined Cycle) processes."
							]
						},
						{
							title: "Waste plastic pyrolysis to fuel oil",
							text: [
								"Plastic pyrolysis can convert petroleum-based waste streams such as plastics into fuels and carbons.",
								"The pyrolysis oil can be used to generate power, but is less efficient than commercial oil (diesel and gasoline).",
								"The physical properties of pyrolysis oil are similar to those of commercial oil, except for the fact that pyrolysis oils have higher viscosity than commercial oils. The chemical properties of the two oils are similar to each other.",
								"One of the variation of these methods is catalytic conversions of the waste plastic. Popularized by Prof D-r D.Donkov, its commonly pirogenetic process with fractional condensation via catalytic plates. The \"key\" is type of catalytic plates, based on the sintered materials. Formula is closed by inventor. The products are similar to common fuels on the market."
							]
						},
						{
							title: "Heat compression",
							text: [
								"Heat compression takes all unsorted, cleaned plastic in all forms, from soft plastic bags to hard industrial waste, and mixes the load in tumblers (large rotating drums resembling giant clothes dryers). The most obvious benefit to this method is that all plastic is recyclable, not just matching forms. However, the method is criticised for the energy costs of rotating the drums and heating the post-melt pipes."
							]
						},
						{
							title: "Distributed recycling",
							text: [
								"Distributed recycling of plastics using additive manufacturing (or DRAM) can include mechanical grinding to make granules for 1) fused granular fabrication, 2) heated syringe printing, 3) 3-D printed molds coupled to injection molding and 4) filament production in a recyclebot to fused filament fabrication. For some waste plastics, technical devices called recyclebots enable a form of distributed recycling by making 3D printing filament. Preliminary life-cycle analysis (LCA) indicates that such distributed recycling of HDPE to make filament for fused filament 3D printers in rural regions is energetically favorable to either using virgin resin or conventional recycling processes because of reductions in transportation energy."
							]
						},
						{
							title: "Chemical recycling",
							text: [
								"For some polymers, it is possible to convert them back into monomers, for example, PET can be treated with an alcohol and a catalyst to form a dialkyl terephthalate. The terephthalate diester can be used with ethylene glycol to form a new polyester polymer, thus making it possible to use the pure polymer again.",
								"An estimated 60 companies are pursuing chemical recycling as of 2019.",
								"In 2019, Eastman Chemical Company announced initiatives for methanolysis of polyesters and polymer gasification to syngas designed to handle a greater variety of used material.",
								"In 2019, Brightmark Energy in the United States began building a facility to convert 100,000 tons of mixed plastic per into diesel, naphtha blend stocks, and wax; the company plans to expand into building another plant which can process an additional 800,000 tons of plastic per year. The company has said that the economics have a significant margin of safety from price declines.",
								"Polymers such as PET can also be treated with natural or engineered enzymes to generate chemically recycled monomers. In a 2020 issue of Nature, Tournier et al. investigated naturally occurring PETase as the basis to engineer new enzymes with higher specific activity and improved thermal stability. Using these enzymes, the researchers produced usable quantities of monomer; after additional purification, this recovered monomer was successfully used to produce PET resin with mechanical properties comparable to virgin PET. Research to improve the activity and stability of depolymerization enzymes is critical to allow this technology to be scaled industrially in a cost-effective manner.",
								"Chemical recycling can be divided into three categories, which are Purification, Depolymerisation, and Feedstock (thermal conversion) recycling."
							]
						},
						{
							title: "Pyrolysis",
							text: [
								"Pyrolysis is one of the two main processes of Feedstock recycling. In pyrolysis, there are two different processes, which are thermal pyrolysis and catalytic pyrolysis. The final products of these processes are liquid oil, hydrocarbon-rich gas, and char.",
								"Compare with the thermal pyrolysis process, the catalytic pyrolysis process has the presence of a catalyst. Different catalysts, such as fluid catalytic cracking (FCC) or natural zeolite (NZ) are mixed with the sample feedstock in the pyrolysis reactor in order to improve the percentage of product yield of catalytic pyrolysis.",
								"A study reported that temperature controls the decomposition behavior and the breaking reaction of the plastics materials. Thus, different temperatures produce different products. Pyrolysis proceeds of polyethylene PE at 760 °C can produce 55.8% of gas and 42.4% of oil-containing raw materials. On the other hand, at 530 °C, the process can only bring out 7.6% of gas and about 50.3% of oil. Based on these parameters, recycling facilities can control the products created from the pyrolysis of plastic waste."
							]
						}
					],
					footer: "*Original article: https://en.wikipedia.org/wiki/Plastic_recycling"
				},
				image: "/plastic-waste.png",
				placeImgLeft: false
			},
		];
	}

	makeRow = (content, imagePath, placeImgLeft) => {
		let imageDiv = <div className="col-md-3 text-center">
			<img alt="Garbage Type" src={imagePath} className="img-thumbnail bg-transparent border-0"/>
		</div>;
		let textDiv = <div className="col-md-9 p-3" style={{backgroundColor: '#fff', borderRadius: '15px'}}>
			<h4 className="text-center mb-4">{content.title}</h4>
			{content.paragraphs.map((paragraph, idx) => <div key={idx}>
				<h6 className="text-center">{paragraph.title}</h6>
				{
					paragraph.text.map((item, i) => <p key={i}>{item}</p>)
				}
			</div>)}
			<small className="text-muted">{content.footer}</small>
		</div>;
		if (placeImgLeft) {
			return <div className="row my-3">{imageDiv}{textDiv}</div>;
		}

		return <div className="row my-3" id={content.id}>{textDiv}{imageDiv}</div>;
	}

	render () {
		return <div>
			<div className="row mb-3">
				<div className="col-md-12">
					<h2 className="w-100 text-center">INFORMATION</h2>
				</div>
			</div>
			{this.garbageTypesData.map(data => this.makeRow(data.content, data.image, data.placeImgLeft))}
		</div>;
	}
}
