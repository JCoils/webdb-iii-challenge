const router = require('express').Router();

const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3'
    }
}

const db = knex(knexConfig);


//check
router.get('/', (req, res) => {
    db('cohorts')
    .then(cohorts => {
        res.status(200).json(cohorts)
    })
    .catch(err => {
        res.status(500).json(err)
    })
}); 

//check
router.get('/:id', (req, res) => {
    db('cohorts')
    .where({ id: req.params.id })
    .first()
    .then(cohort => {
        if(cohort) {
            res.status(200).json(cohort)
        } else {
            res.status(404).json({ message: 'was not found!' })
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

router.get('/:id/students', (req, res) => {
    const id = req.params.id;
    db('cohorts')
      .join('students', 'students.cohort_id', 'cohorts.id')
      .select('students.id', 'students.name')
      .where('cohorts.id', id)
      .first()
      .then(stu => {
        if (stu) {
          res.status(200).json(stu);
        } else {
          res.status(404).json({ message: 'No students were found.' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
});


router.post('/', async (req, res) => {
    try {
        const [id] = await db('cohorts').insert(req.body);
        const cohort = await db('cohorts')
        .where({ id })
        .first()
        res.status(201).json(cohort)
    } catch (error) {
        res.status(500).json({ error: 'There was an error!' })
    }
});


router.put('/:id', (req, res) => {
    db('cohorts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
        if (count > 0) {
        db('cohorts')
        .where({ id: req.params.id })
        .first()
        .then(cohort => {
            res.status(200).json(cohort)
        })
    } else {
        res.status(404).json({ message: 'information was not updated! '})
    }
    })
    .catch(error => {
        res.status(500).json(error)
    })
});


router.delete('/:id', (req, res) => {
    db('cohorts')
    .where({ id: req.params.id })
    .del(req.body)
    .then(count => {
        if (count > 0) {
        db('cohorts')
        .where({ id: req.params.id })
        .first()
        .then(cohort => {
            res.status(200).json(cohort)
        })
    } else {
        res.status(404).json({ message: ' was not found! '})
    }
    })
    .catch(error => {
        res.status(500).json(error)
    })
});


module.exports = router;