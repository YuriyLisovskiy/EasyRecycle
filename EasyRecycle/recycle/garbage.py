ORGANIC = 'OR'
GLASS = 'GL'
METAL = 'ME'
PAPER = 'PA'
PLASTIC = 'PL'


TYPE_CHOICES = [
	(ORGANIC, 'Organic'),
	(GLASS, 'Glass'),
	(METAL, 'Metal'),
	(PAPER, 'Paper'),
	(PLASTIC, 'Plastic')
]

GARBAGE_TO_POINTS = {
	ORGANIC: 1,
	GLASS: 2,
	METAL: 3,
	PAPER: 4,
	PLASTIC: 5
}
